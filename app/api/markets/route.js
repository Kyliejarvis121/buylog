import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const markets = await prisma.market.findMany({
      orderBy: { createdAt: "desc" },
      include: { categories: true }, // include related categories
    });

    return NextResponse.json({
      success: true,
      data: markets,
    });
  } catch (error) {
    // Use proper type-safe logging
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
