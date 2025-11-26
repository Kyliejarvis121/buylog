import { prisma } from "@/lib/prismadb";
import { NextResponse } from "next/server";

// ----------- CREATE MARKET -----------
export async function POST(request) {
  try {
    const body = await request.json();
    const { title, slug, logoUrl, description, isActive, categoryIds } = body;

    if (!title || !slug) {
      return NextResponse.json(
        { data: null, message: "Title and Slug are required" },
        { status: 400 }
      );
    }

    // Check if market exists
    const existing = await prisma.market.findUnique({
      where: { slug },
    });

    if (existing) {
      return NextResponse.json(
        { data: null, message: `Market (${title}) already exists` },
        { status: 409 }
      );
    }

    // Create market
    const newMarket = await prisma.market.create({
      data: {
        title,
        slug,
        logoUrl,
        description,
        isActive: Boolean(isActive),

        // If categories exist, connect them
        categories: categoryIds?.length
          ? { connect: categoryIds.map((id) => ({ id })) }
          : undefined,
      },
    });

    return NextResponse.json(
      { data: newMarket, message: "Market created successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/markets failed:", error);
    return NextResponse.json(
      { data: null, message: "Failed to create market", error: error.message },
      { status: 500 }
    );
  }
}

// ----------- GET ALL MARKETS -----------
export async function GET() {
  try {
    const markets = await prisma.market.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        categories: true,
      },
    });

    return NextResponse.json({
      data: markets,
      message: "Markets fetched successfully",
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
