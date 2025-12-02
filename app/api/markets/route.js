import { prisma } from "@/lib/prismadb"; // make sure this is the correct Prisma client
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

// GET: fetch all markets with their categories
export async function GET() {
  try {
    const markets = await prisma.market.findMany({
      include: { categories: true }, // fetch related categories
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, data: markets });
  } catch (error) {
    console.error("MARKETS API ERROR:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch markets", error: error.message },
      { status: 500 }
    );
  }
}

// POST: create a new market
export async function POST(req) {
  try {
    const { name, categoryIds } = await req.json();

    if (!name) {
      return NextResponse.json({ success: false, message: "Market name is required" }, { status: 400 });
    }

    const market = await prisma.market.create({
      data: {
        name,
        categories: {
          connect: categoryIds?.map((id) => ({ id })) || [],
        },
      },
      include: { categories: true },
    });

    return NextResponse.json({ success: true, data: market });
  } catch (error) {
    console.error("POST /api/markets failed:", error);
    return NextResponse.json(
      { success: false, message: "Failed to create market", error: error.message },
      { status: 500 }
    );
  }
}
