// Route: app/api/categories/route.js
import { prisma } from "@/lib/prismadb";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

// CREATE CATEGORY
export async function POST(request) {
  try {
    const { title, slug, imageUrl, description, isActive } = await request.json();

    // Check if slug exists
    if (slug) {
      const existing = await prisma.category.findUnique({ where: { slug } });
      if (existing) {
        return NextResponse.json({ data: null, message: `Category (${title}) already exists` }, { status: 409 });
      }
    }

    const newCategory = await prisma.category.create({
      data: { title, slug, imageUrl, description, isActive },
    });

    return NextResponse.json({ data: newCategory, message: "Category created successfully" }, { status: 201 });
  } catch (error) {
    console.error("POST /api/categories failed:", error);
    return NextResponse.json({ data: null, message: "Failed to create category", error: error.message }, { status: 500 });
  }
}

// GET ALL CATEGORIES
export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { createdAt: "desc" },
      include: { products: true }, // include products to avoid frontend crashes
    });

    return NextResponse.json({ data: categories, message: "Categories fetched successfully" });
  } catch (error) {
    console.error("GET /api/categories failed:", error);
    return NextResponse.json({ data: [], message: "Failed to fetch categories", error: error.message }, { status: 500 });
  }
}
