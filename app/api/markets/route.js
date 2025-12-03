// app/api/markets/route.js
import { prisma } from "@/lib/prismadb";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

// GET all markets
export async function GET() {
  try {
    const markets = await prisma.market.findMany();

    // Fetch categories for each market
    const marketsWithCategories = await Promise.all(
      markets.map(async (market) => {
        const categories = await prisma.category.findMany({
          where: { id: { in: market.categoryIds || [] } },
        });
        return { ...market, categories };
      })
    );

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

    // Validate required fields
    if (!title) {
      return NextResponse.json(
        { success: false, data: null, message: "Title is required" },
        { status: 400 }
      );
    }

    // Ensure categoryIds is an array
    if (!Array.isArray(categoryIds)) {
      categoryIds = categoryIds ? [categoryIds] : [];
    }

    // Create new market
    const newMarket = await prisma.market.create({
      data: {
        title,
        slug,
        description: description || "",
        logoUrl: logoUrl || "",
        isActive: isActive ?? true,
        categoryIds,
      },
    });

    return NextResponse.json({
      success: true,
      data: newMarket,
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
