import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    const markets = await prisma.market.findMany({
      orderBy: { createdAt: "desc" },
      // Explicitly include relations only, no $scalars
      include: {
        categories: true,
      },
      // If you only need specific fields from Market itself:
      // select: { id: true, name: true, createdAt: true, categories: true }
    });

    const totalMarkets = await prisma.market.count();

    return NextResponse.json({
      success: true,
      data: {
        totalMarkets,
        markets,
      },
    });
  } catch (error) {
    console.error("MARKETS API ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch markets",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
