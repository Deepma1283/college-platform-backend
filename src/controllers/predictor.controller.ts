import { Request, Response } from "express";
import db from "../db";

export const predict = async (req: Request, res: Response) => {
  try {
    const { exam, rank } = req.query;
    if (!exam || !rank) return res.status(400).json({ error: "exam and rank are required" });
    const rankNum = parseInt(rank as string);
    if (isNaN(rankNum) || rankNum < 1) return res.status(400).json({ error: "rank must be a positive number" });
    const examUpper = (exam as string).toUpperCase().replace(" ", "_");

    const rules = await db.predictorRule.findMany({
      where: { exam: examUpper, rankMin: { lte: rankNum }, rankMax: { gte: rankNum } },
      include: { college: { include: { courses: { take: 3 }, _count: { select: { reviews: true } } } } },
    });

    const seen = new Set<number>();
    const results: any[] = [];
    for (const rule of rules) {
      if (seen.has(rule.collegeId)) continue;
      seen.add(rule.collegeId);
      const range = rule.rankMax - rule.rankMin;
      const position = rankNum - rule.rankMin;
      const percentile = range > 0 ? position / range : 0;
      const chance = percentile < 0.33 ? "High" : percentile < 0.66 ? "Medium" : "Low";
      results.push({
        college: { id: rule.college.id, slug: rule.college.slug, name: rule.college.name, location: rule.college.location, fees: rule.college.fees, rating: rule.college.rating, placementPercent: rule.college.placementPercent, avgPackage: rule.college.avgPackage, type: rule.college.type, reviewCount: rule.college._count.reviews },
        branch: rule.branch, chance, rankRange: { min: rule.rankMin, max: rule.rankMax },
      });
    }
    const order = { High: 0, Medium: 1, Low: 2 };
    results.sort((a, b) => order[a.chance as keyof typeof order] - order[b.chance as keyof typeof order] || b.college.rating - a.college.rating);
    res.json({ data: results, meta: { exam: examUpper, rank: rankNum, totalResults: results.length } });
  } catch (error) {
    res.status(500).json({ error: "Prediction failed" });
  }
};

export const getExamList = async (_req: Request, res: Response) => {
  res.json({ data: [
    { value: "JEE_MAIN", label: "JEE Main", description: "NITs, IIITs, and other CFTIs" },
    { value: "JEE_ADVANCED", label: "JEE Advanced", description: "Indian Institutes of Technology" },
    { value: "NEET", label: "NEET", description: "Medical colleges (MBBS, BDS)" },
    { value: "CAT", label: "CAT", description: "IIMs and top B-Schools" },
    { value: "GATE", label: "GATE", description: "IITs and NITs for M.Tech" },
  ]});
};
