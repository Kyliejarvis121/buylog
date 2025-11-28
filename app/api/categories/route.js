// Route: app/api/categories/route.js
import { prisma } from "@/lib/prismadb";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

// CREATE CATEGORY
export async function POST(request) {
  try {
    const { title, slug, imageUrl, description, isActive } = await request.json();

    // Validate required fields
    if (!title || !slug) {
      return NextResponse.json(
        { data: null, message: "Title and slug are required" },
        { status: 400 }
      );
    }

    // Check if slug exists
    const existing = await prisma.category.findUnique({ where: { slug } });
    if (existing) {
      return NextResponse.json(
        { data: null, message: `Category (${title}) already exists` },
        { status: 409 }
      );
    }

    const newCategory = await prisma.category.create({
      data: { 
        title, 
        slug, 
        imageUrl: imageUrl ?? "", 
        description: description ?? "", 
        isActive: Boolean(isActive) 
      },
    });

    return NextResponse.json(
      { data: newCategory, message: "Category created successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/categories failed:", error);
    return NextResponse.json(
      { data: null, message: "Failed to create category", error: error.message },
      { status: 500 }
    );
  }
}

// GET ALL CATEGORIES WITH PAGINATION
export async function GET(request) {
  try {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get("page") ?? "1");
    const limit = parseInt(url.searchParams.get("limit") ?? "20");
    const skip = (page - 1) * limit;

    const categories = await prisma.category.findMany({
      orderBy: { createdAt: "desc" },
      include: { products: true }, // prevents frontend crashes
      skip,
      take: limit,
    });

    const total = await prisma.category.count();

    return NextResponse.json({
      data: categories,
      total,
      page,
      limit,
      message: `Fetched ${categories.length} categories out of ${total}`,
    });
  } catch (error) {
    console.error("GET /api/categories failed:", error);
    return NextResponse.json(
      { data: [], message: "Failed to fetch categories", error: error.message },
      { status: 500 }
    );
  }
}
