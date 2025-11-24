// app/api/categories/route.js
import { prisma } from "@/lib/prismadb";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

// Create a new category
export async function POST(request) {
  try {
    const { title, slug, imageUrl, description, isActive } = await request.json();

    // Check if slug exists
    if (slug) {
      const existing = await prisma.categories.findUnique({ where: { slug } });
      if (existing) {
        return NextResponse.json(
          { data: null, message: `Category (${title}) already exists` },
          { status: 409 }
        );
      }
    }

    const newCategory = await prisma.categories.create({
      data: { title, slug, imageUrl, description, isActive },
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

// Fetch all categories
export async function GET() {
  try {
    const categories = await prisma.categories.findMany({
      orderBy: { createdAt: "desc" },
    });

    // Ensure each category has a products array to avoid frontend crashes
    const safeCategories = categories.map((cat) => ({
      ...cat,
      products: cat.products ?? [],
    }));

    return NextResponse.json({
      success: true,
      data: safeCategories,
      message: "Categories fetched successfully",
    });
  } catch (error) {
    console.error("GET /api/categories failed:", error);
    return NextResponse.json(
      { success: false, data: [], message: "Failed to fetch categories", error: error.message },
      { status: 500 }
    );
  }
}
