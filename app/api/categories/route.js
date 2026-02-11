// Route: app/api/categories/route.js
import { prisma } from "@/lib/prismadb";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

// CREATE CATEGORY
export async function POST(request) {
  try {
    const { title, slug, imageUrl, description, isActive, iconKey } =
      await request.json();

    if (!title || !slug) {
      return NextResponse.json(
        { data: null, message: "Title and slug are required" },
        { status: 400 }
      );
    }

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
        iconKey: iconKey ?? null,
        isActive: Boolean(isActive),
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

// ✅ GET ALL ACTIVE CATEGORIES (FOR HOMEPAGE & PRODUCT FORM)
export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      where: { isActive: true },  // ✅ only active categories
      orderBy: { createdAt: "asc" },
    });

    return NextResponse.json({
      data: categories,
      total: categories.length,
      message: "Categories fetched successfully",
    });
  } catch (error) {
    console.error("GET /api/categories failed:", error);
    return NextResponse.json(
      { data: [], message: "Failed to fetch categories", error: error.message },
      { status: 500 }
    );
  }
}
