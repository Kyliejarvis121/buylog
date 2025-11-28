import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    const markets = await prisma.market.findMany({
      include: {
        categories: true, // include related categories
      },
      orderBy: { createdAt: "desc" },
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
