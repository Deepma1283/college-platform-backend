import { Request, Response } from "express";
import db from "../db";

export const getColleges = async (req: Request, res: Response) => {
  try {
    const { search, location, minFees, maxFees, course, type, sortBy = "rating", sortOrder = "desc", page = "1", limit = "12" } = req.query;
    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;
    const where: any = {};

    if (search) {
      where.OR = [
        { name: { contains: search as string, mode: "insensitive" } },
        { city: { contains: search as string, mode: "insensitive" } },
        { state: { contains: search as string, mode: "insensitive" } },
      ];
    }
    if (location) {
      where.state = { contains: location as string, mode: "insensitive" };
    }
    if (minFees || maxFees) {
      where.fees = {};
      if (minFees) where.fees.gte = parseInt(minFees as string);
      if (maxFees) where.fees.lte = parseInt(maxFees as string);
    }
    if (type) where.type = type;
    if (course) {
      where.courses = { some: { category: { equals: course as string, mode: "insensitive" } } };
    }

    const validSortFields: Record<string, string> = { rating: "rating", fees: "fees", placement: "placementPercent", name: "name" };
    const orderBy: any = {};
    orderBy[validSortFields[sortBy as string] || "rating"] = sortOrder === "asc" ? "asc" : "desc";

    const [colleges, total] = await Promise.all([
      db.college.findMany({
        where, orderBy, skip, take: limitNum,
        include: { courses: { take: 3, select: { name: true, category: true, fees: true } }, _count: { select: { reviews: true } } },
      }),
      db.college.count({ where }),
    ]);

    res.json({ data: colleges, pagination: { total, page: pageNum, limit: limitNum, totalPages: Math.ceil(total / limitNum), hasNext: pageNum < Math.ceil(total / limitNum), hasPrev: pageNum > 1 } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch colleges" });
  }
};

export const getCollegeById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const college = await db.college.findFirst({
      where: { OR: [{ id: isNaN(parseInt(id)) ? undefined : parseInt(id) }, { slug: id }] },
      include: { courses: true, reviews: { orderBy: { createdAt: "desc" }, take: 10 }, _count: { select: { reviews: true } } },
    });
    if (!college) return res.status(404).json({ error: "College not found" });
    res.json({ data: college });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch college" });
  }
};

export const compareColleges = async (req: Request, res: Response) => {
  try {
    const { ids } = req.query;
    if (!ids) return res.status(400).json({ error: "College IDs are required" });
    const idList = (ids as string).split(",").map((id) => { const n = parseInt(id.trim()); return isNaN(n) ? id.trim() : n; });
    if (idList.length < 2 || idList.length > 3) return res.status(400).json({ error: "Provide 2 to 3 college IDs" });
    const colleges = await db.college.findMany({
      where: { OR: idList.map((id) => typeof id === "number" ? { id } : { slug: id as string }) },
      include: { courses: true, _count: { select: { reviews: true } } },
    });
    const comparison = colleges.map((c) => ({
      id: c.id, slug: c.slug, name: c.name, location: c.location, type: c.type,
      established: c.established, fees: c.fees, rating: c.rating,
      reviewCount: c._count.reviews, placementPercent: c.placementPercent,
      avgPackage: c.avgPackage, highestPackage: c.highestPackage,
      totalCourses: c.courses.length, courseCategories: [...new Set(c.courses.map((x) => x.category))],
      affiliation: c.affiliation,
    }));
    res.json({ data: comparison });
  } catch (error) {
    res.status(500).json({ error: "Failed to compare colleges" });
  }
};

export const searchCollegeNames = async (req: Request, res: Response) => {
  try {
    const { q } = req.query;
    if (!q || (q as string).length < 2) return res.json({ data: [] });
    const colleges = await db.college.findMany({
      where: { OR: [{ name: { contains: q as string, mode: "insensitive" } }, { city: { contains: q as string, mode: "insensitive" } }] },
      select: { id: true, name: true, slug: true, city: true, state: true },
      take: 8,
    });
    res.json({ data: colleges });
  } catch (error) {
    res.status(500).json({ error: "Search failed" });
  }
};
