// Route: GET /api/markets/[id]
import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(request, { params: { id } }) {
  try {
    const market = await prisma.market.findUnique({ where: { id } });
    if (!market) return NextResponse.json({ data: null, message: "Market not found" }, { status: 200 });
    return NextResponse.json({ data: market });
  } catch (error) {
    console.error("Failed to fetch market:", error);
    return NextResponse.json({ message: "Failed to Fetch Market", error: error.message }, { status: 500 });
  }
}
