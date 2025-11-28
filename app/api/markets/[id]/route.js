// Route: GET /api/markets/[id]
import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb"; // important for MongoDB

export async function GET(request, { params: { id } }) {
  try {
    if (!id) return NextResponse.json({ data: null, message: "Market ID is required" }, { status: 400 });

    // Convert string ID to ObjectId
    const market = await prisma.market.findUnique({
      where: { id: new ObjectId(id) },
    });

    if (!market) {
      return NextResponse.json({ data: null, message: "Market not found" }, { status: 200 });
    }

    return NextResponse.json({ data: market, success: true });
  } catch (error) {
    console.error("Failed to fetch market:", error);
    return NextResponse.json(
      { message: "Failed to Fetch Market", error: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
