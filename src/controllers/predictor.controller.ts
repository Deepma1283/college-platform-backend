// import { Request, Response } from "express";
// import db from "../db";

// export const predict = async (req: Request, res: Response) => {
//   try {
//     const { exam, rank } = req.query;
//     if (!exam || !rank) return res.status(400).json({ error: "exam and rank are required" });
//     const rankNum = parseInt(rank as string);
//     if (isNaN(rankNum) || rankNum < 1) return res.status(400).json({ error: "rank must be a positive number" });
//     const examUpper = (exam as string).toUpperCase().replace(" ", "_");

//     const rules = await db.predictorRule.findMany({
//       where: { exam: examUpper, rankMin: { lte: rankNum }, rankMax: { gte: rankNum } },
//       include: { college: { include: { courses: { take: 3 }, _count: { select: { reviews: true } } } } },
//     });

//     const seen = new Set<number>();
//     const results: any[] = [];
//     for (const rule of rules) {
//       if (seen.has(rule.collegeId)) continue;
//       seen.add(rule.collegeId);
//       const range = rule.rankMax - rule.rankMin;
//       const position = rankNum - rule.rankMin;
//       const percentile = range > 0 ? position / range : 0;
//       const chance = percentile < 0.33 ? "High" : percentile < 0.66 ? "Medium" : "Low";
//       results.push({
//         college: { id: rule.college.id, slug: rule.college.slug, name: rule.college.name, location: rule.college.location, fees: rule.college.fees, rating: rule.college.rating, placementPercent: rule.college.placementPercent, avgPackage: rule.college.avgPackage, type: rule.college.type, reviewCount: rule.college._count.reviews },
//         branch: rule.branch, chance, rankRange: { min: rule.rankMin, max: rule.rankMax },
//       });
//     }
//     const order = { High: 0, Medium: 1, Low: 2 };
//     results.sort((a, b) => order[a.chance as keyof typeof order] - order[b.chance as keyof typeof order] || b.college.rating - a.college.rating);
//     res.json({ data: results, meta: { exam: examUpper, rank: rankNum, totalResults: results.length } });
//   } catch (error) {
//     res.status(500).json({ error: "Prediction failed" });
//   }
// };

// export const getExamList = async (_req: Request, res: Response) => {
//   res.json({ data: [
//     { value: "JEE_MAIN", label: "JEE Main", description: "NITs, IIITs, and other CFTIs" },
//     { value: "JEE_ADVANCED", label: "JEE Advanced", description: "Indian Institutes of Technology" },
//     { value: "NEET", label: "NEET", description: "Medical colleges (MBBS, BDS)" },
//     { value: "CAT", label: "CAT", description: "IIMs and top B-Schools" },
//     { value: "GATE", label: "GATE", description: "IITs and NITs for M.Tech" },
//   ]});
// };

import { Request, Response } from "express";
import { Prisma, ExamType } from "@prisma/client";
import db from "../db"; // Prisma client

// ─── Types ────────────────────────────────────────────────────────────────────

type Chance = "High" | "Medium" | "Low";
type Category = "reach" | "target" | "safety";

// Derive the rule type directly from the Prisma query so it never drifts.
type PredictorRule = Prisma.PredictorRuleGetPayload<{
  include: {
    college: {
      include: {
        courses: { take: 3; select: { name: true } };
        _count: { select: { reviews: true } };
      };
    };
  };
}>;

interface PredictionResult {
  college: {
    id: number;
    slug: string;
    name: string;
    location: string;
    fees: number;
    rating: number;
    placementPercent: number;
    avgPackage: number;
    type: string;
    reviewCount: number;
    topCourses: string[];
  };
  branch: string;
  chance: Chance;
  category: Category;
  chanceLabel: string;
  rankRange: { min: number; max: number };
}

// ─── Constants ────────────────────────────────────────────────────────────────

const CHANCE_ORDER: Record<Chance, number> = { High: 0, Medium: 1, Low: 2 };

const CHANCE_LABELS: Record<Chance, string> = {
  High:   ">85% chance",
  Medium: "50–85% chance",
  Low:    "<50% chance",
};

// Lower rank number = better rank in JEE/NEET context.
// cutoff_rank is the *worst* rank that was admitted last year.
// If userRank <= cutoff → realistic/safe. If userRank > cutoff → reach.
//
// Thresholds (configurable per exam if needed):
const SAFETY_BUFFER = 5_000;   // userRank is this much better than cutoff → Safety
const TARGET_BUFFER = 2_000;   // userRank within ±2000 of cutoff → Target
//                               Beyond TARGET_BUFFER worse → Reach (up to REACH_LIMIT)
const REACH_LIMIT   = 5_000;   // userRank worse than cutoff by this much → ignored (too far)

const RESULTS_PER_CATEGORY = 5;

const EXAM_LIST = [
  { value: "JEE_MAIN",     label: "JEE Main",     description: "NITs, IIITs, and other CFTIs" },
  { value: "JEE_ADVANCED", label: "JEE Advanced", description: "Indian Institutes of Technology" },
  { value: "NEET",         label: "NEET",          description: "Medical colleges (MBBS, BDS)" },
  { value: "CAT",          label: "CAT",           description: "IIMs and top B-Schools" },
  { value: "GATE",         label: "GATE",          description: "IITs and NITs for M.Tech" },
] as const;

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Normalise exam string: "jee main" → "JEE_MAIN" */
function normaliseExam(exam: string): string {
  return exam.toUpperCase().trim().replace(/\s+/g, "_");
}

/**
 * Categorise a college based on how the user's rank compares to the cutoff.
 *
 * In Indian entrance exams a *lower* rank number is *better*.
 * cutoffRank = worst (highest number) rank admitted last year.
 *
 *   difference = cutoffRank - userRank
 *   difference ≥ SAFETY_BUFFER  → Safety  (user is comfortably better)
 *   -TARGET_BUFFER ≤ diff < SAFETY_BUFFER → Target (borderline)
 *   -REACH_LIMIT  ≤ diff < -TARGET_BUFFER → Reach  (user is slightly worse)
 *   diff < -REACH_LIMIT          → skip (too far out of reach)
 */
function categorise(
  userRank: number,
  cutoffRank: number
): { category: Category; chance: Chance } | null {
  const diff = cutoffRank - userRank;

  if (diff >= SAFETY_BUFFER)                        return { category: "safety", chance: "High" };
  if (diff >= -TARGET_BUFFER && diff < SAFETY_BUFFER) return { category: "target", chance: "Medium" };
  if (diff >= -REACH_LIMIT   && diff < -TARGET_BUFFER) return { category: "reach",  chance: "Low" };
  return null; // Rank is too far outside the cutoff range — not useful to show
}

/** Limit an array to at most `n` items without triggering strict-mode .slice() overload errors. */
function take<T>(arr: T[], n: number): T[] {
  return arr.filter((_, i) => i < n);
}

/** Build the structured result object from a Prisma rule row. */
function buildResult(
  rule: PredictorRule,
  category: Category,
  chance: Chance
): PredictionResult {
  return {
    college: {
      id:               rule.college.id,
      slug:             rule.college.slug,
      name:             rule.college.name,
      location:         rule.college.location,
      fees:             rule.college.fees,
      rating:           rule.college.rating,
      placementPercent: rule.college.placementPercent,
      avgPackage:       rule.college.avgPackage,
      type:             rule.college.type,
      reviewCount:      rule.college._count.reviews,
      topCourses:       rule.college.courses.map((c) => c.name),
    },
    branch:      rule.branch,
    chance,
    category,
    chanceLabel: CHANCE_LABELS[chance],
    rankRange:   { min: rule.rankMin, max: rule.rankMax },
  };
}

// ─── Controller: POST /api/predictor ─────────────────────────────────────────

export const predict = async (req: Request, res: Response): Promise<void> => {
  try {
    // ── 1. Validate inputs ───────────────────────────────────────────────────
    const { exam, rank, branch } = req.query as Record<string, string | undefined>;

    if (!exam || !rank) {
      res.status(400).json({ error: "exam and rank are required" });
      return;
    }

    const userRank = parseInt(rank, 10);
    if (isNaN(userRank) || userRank < 1) {
      res.status(400).json({ error: "rank must be a positive integer" });
      return;
    }

    const examUpper = normaliseExam(exam);

    // ── 2. Single optimised DB query via Prisma ──────────────────────────────
    //
    // Fetch only rows where the user's rank *could* be relevant:
    //   rankMin ≤ userRank + REACH_LIMIT  (not so far out of reach we'd skip it)
    //   rankMax ≥ userRank - SAFETY_BUFFER (not so safe it's irrelevant)
    //
    // This avoids pulling the entire table and lets PostgreSQL use the
    // composite index on (exam, rankMin, rankMax).

    const rules = await db.predictorRule.findMany({
      where: {
        exam:    examUpper as ExamType,
        rankMin: { lte: userRank + REACH_LIMIT },
        rankMax: { gte: userRank - SAFETY_BUFFER },
        ...(branch ? { branch } : {}),
      },
      include: {
        college: {
          include: {
            courses: { take: 3, select: { name: true } },
            _count:  { select: { reviews: true } },
          },
        },
      },
    });

    // ── 3. Categorise into Reach / Target / Safety ───────────────────────────
    //
    // Use the *midpoint* of the rule's rank range as a proxy for last year's
    // median cutoff. This is more nuanced than a single cutoff_rank column and
    // maps naturally onto the Prisma schema (rankMin / rankMax).

    const reach:  PredictionResult[] = [];
    const target: PredictionResult[] = [];
    const safety: PredictionResult[] = [];

    // Deduplicate by collegeId — keep the branch with the best chance for this rank.
    const seenCollegeIds = new Set<number>();

    for (const rule of rules) {
      const midpointCutoff = Math.round((rule.rankMin + rule.rankMax) / 2);
      const result = categorise(userRank, midpointCutoff);
      if (!result) continue;

      // Allow multiple branches of the same college (useful for IITs/NITs)
      // but deduplicate the exact same college+branch combo.
      const key = `${rule.collegeId}-${rule.branch}`;
      if (seenCollegeIds.has(+key.replace("-", ""))) continue;
      seenCollegeIds.add(+key.replace("-", ""));

      const entry = buildResult(rule, result.category, result.chance);
      if (result.category === "reach")  reach.push(entry);
      if (result.category === "target") target.push(entry);
      if (result.category === "safety") safety.push(entry);
    }

    // ── 4. Sort each category by rating (desc) ───────────────────────────────
    const byRating = (a: PredictionResult, b: PredictionResult) =>
      b.college.rating - a.college.rating;

    reach.sort(byRating);
    target.sort(byRating);
    safety.sort(byRating);

    // ── 5. Respond ───────────────────────────────────────────────────────────
    res.json({
      success: true,
      data: {
        reach:  take(reach,  RESULTS_PER_CATEGORY),
        target: take(target, RESULTS_PER_CATEGORY),
        safety: take(safety, RESULTS_PER_CATEGORY),
      },
      meta: {
        exam:         examUpper,
        rank:         userRank,
        branch:       branch ?? null,
        totalResults: reach.length + target.length + safety.length,
      },
    });

  } catch (error) {
    console.error("[predict] error:", error);
    res.status(500).json({ error: "Prediction failed" });
  }
};

// ─── Controller: GET /api/predictor/exams ────────────────────────────────────

export const getExamList = (_req: Request, res: Response): void => {
  res.json({ data: EXAM_LIST });
};