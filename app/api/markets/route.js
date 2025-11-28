import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    // Fetch all markets
    const markets = await prisma.market.findMany();

    // For each market, fetch categories separately
    const marketsWithCategories = await Promise.all(
      markets.map(async (market) => {
        const categories = await prisma.category.findMany({
          where: { marketId: market.id }, // adjust your relation field
        });
        return { ...market, categories };
      })
    );

    return NextResponse.json({
      success: true,
      data: marketsWithCategories,
    });
  } catch (error) {
    console.error("MARKETS API ERROR:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch markets",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

