// Route: GET /api/markets
import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const url = new URL(request.url);

    // Pagination params
    const page = parseInt(url.searchParams.get("page") ?? "1");
    const limit = parseInt(url.searchParams.get("limit") ?? "20");
    const skip = (page - 1) * limit;

    // Optional search by market name
    const search = url.searchParams.get("q")?.trim() ?? "";

    const where = search
      ? { name: { contains: search, mode: "insensitive" } }
      : {};

    const markets = await prisma.market.findMany({
      where,
      include: {
        categories: true, // will include categories if they exist
      },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    });

    const total = await prisma.market.count({ where });

    return NextResponse.json({
      data: markets,
      total,
      page,
      limit,
      message: `Fetched ${markets.length} markets out of ${total}`,
    });
  } catch (error) {
    console.error("GET /api/markets failed:", error);
    return NextResponse.json(
      {
        data: [],
        message: "Failed to fetch markets",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
