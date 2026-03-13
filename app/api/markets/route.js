// app/api/markets/route.js
import { prisma } from "@/lib/prismadb";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

// GET all markets
export async function GET() {
  try {
    const markets = await prisma.market.findMany({
      include: {
        marketCategories: {
          include: { category: true },
        },
      },
    });

    // Map to include categories directly
    const marketsWithCategories = markets.map((market) => ({
      ...market,
      categories: market.marketCategories.map((mc) => mc.category),
    }));

    return NextResponse.json({
      success: true,
      data: marketsWithCategories,
    });
  } catch (error) {
    console.error("GET /api/markets failed:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch markets", error: error.message },
      { status: 500 }
    );
  }
}

// CREATE a new market
export async function POST(request) {
  try {
    const body = await request.json();
    let { title, slug, description, logoUrl, isActive, categoryIds } = body;

    if (!title) {
      return NextResponse.json(
        { success: false, data: null, message: "Title is required" },
        { status: 400 }
      );
    }

    // Ensure categoryIds is an array
    if (!Array.isArray(categoryIds)) categoryIds = categoryIds ? [categoryIds] : [];

    // Create the market with explicit many-to-many relation
    const newMarket = await prisma.market.create({
      data: {
        title,
        slug,
        description: description || "",
        logoUrl: logoUrl || "",
        isActive: isActive ?? true,
        marketCategories: {
          create: categoryIds.map((id) => ({ categoryId: id })),
        },
      },
      include: {
        marketCategories: { include: { category: true } },
      },
    });

    // Map categories for the response
    const result = {
      ...newMarket,
      categories: newMarket.marketCategories.map((mc) => mc.category),
    };

    return NextResponse.json({
      success: true,
      data: result,
      message: "Market created successfully",
    }, { status: 201 });

  } catch (error) {
    console.error("POST /api/markets failed:", error);
    return NextResponse.json(
      { success: false, data: null, message: "Failed to create market", error: error.message },
      { status: 500 }
    );
  }
}
