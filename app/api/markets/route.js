// app/api/markets/route.js
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prismadb";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    // Fetch all markets
    const markets = await prisma.market.findMany();

    // Fetch categories for each market using the categoryIds array
    const marketsWithCategories = await Promise.all(
      markets.map(async (market) => {
        const categories = await prisma.category.findMany({
          where: { id: { in: market.categoryIds } },
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
