import { prisma } from "@/lib/prismadb";
import { NextResponse } from "next/server";

// GET ALL TRAININGS WITH PAGINATION
export async function GET(request) {
  try {
    const url = new URL(request.url);

    // Pagination params
    const page = parseInt(url.searchParams.get("page") ?? "1");
    const limit = parseInt(url.searchParams.get("limit") ?? "20");
    const skip = (page - 1) * limit;

    // Optional search by title
    const search = url.searchParams.get("q")?.trim() ?? "";
    const where = search
      ? { title: { contains: search, mode: "insensitive" } }
      : {};

    const trainings = await prisma.training.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    });

    const total = await prisma.training.count({ where });

    return NextResponse.json({
      data: trainings,
      total,
      page,
      limit,
      message: `Fetched ${trainings.length} trainings out of ${total}`,
    });
  } catch (error) {
    console.error("GET /api/trainings failed:", error);
    return NextResponse.json(
      { data: [], message: "Failed to fetch trainings", error: error.message },
      { status: 500 }
    );
  }
}
