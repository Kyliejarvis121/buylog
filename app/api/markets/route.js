// Route: GET /api/markets
import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const markets = await prisma.market.findMany({
      orderBy: { createdAt: "desc" },
      include: { categories: true },
    });

    return NextResponse.json({ data: markets, message: "Markets fetched successfully" });
  } catch (error) {
    console.error("GET /api/markets failed:", error);
    return NextResponse.json({ data: [], message: "Failed to fetch markets", error: error.message }, { status: 500 });
  }
}
