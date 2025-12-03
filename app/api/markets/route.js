// app/api/markets/route.js
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prismadb";

export const dynamic = "force-dynamic";
export const revalidate = 0;

/* ===========================
   CREATE MARKET  (POST)
=========================== */
export async function POST(request) {
  try {
    const { title, slug, logoUrl, description, categoryIds } =
      await request.json();

    // VALIDATION
    if (!title) {
      return NextResponse.json(
        { success: false, message: "Title is required" },
        { status: 400 }
      );
    }

    // Auto slug
    const finalSlug =
      slug?.trim() ||
      title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

    // CHECK IF SLUG EXISTS
    const existing = await prisma.market.findUnique({
      where: { slug: finalSlug },
    });

    if (existing) {
      return NextResponse.json(
        { success: false, message: `Market with slug "${finalSlug}" already exists` },
        { status: 409 }
      );
    }

    // CREATE MARKET
    const newMarket = await prisma.market.create({
      data: {
        title,
        slug: finalSlug,
        logoUrl,
        description,
        categoryIds: Array.isArray(categoryIds) ? categoryIds : [],
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Market created successfully",
        data: newMarket,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/markets ERROR:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to create market",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

/* ===========================
   GET ALL MARKETS  (GET)
=========================== */
export async function GET() {
  try {
    const markets = await prisma.market.findMany({
      orderBy: { createdAt: "desc" },
    });

    const marketsWithCategories = await Promise.all(
      markets.map(async (market) => {
        const categories = await prisma.category.findMany({
          where: { id: { in: market.categoryIds } },
        });

        return { ...market, categories };
      })
    );

    return NextResponse.json({
      success: true,
      data: marketsWithCategories,
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
