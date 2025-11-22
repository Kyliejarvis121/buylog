import { prisma } from "@/lib/prismadb";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { title, slug, imageUrl, description, isActive } = await request.json();

    // Check for existing slug
    if (slug) {
      const existing = await prisma.categories.findUnique({ where: { slug } });
      if (existing) return NextResponse.json({ data: null, message: `Category (${title}) already exists` }, { status: 409 });
    }

    const newCategory = await prisma.categories.create({ data: { title, slug, imageUrl, description, isActive } });
    return NextResponse.json({ data: newCategory, message: "Category created successfully" }, { status: 201 });
  } catch (error) {
    console.error("POST /api/categories failed:", error);
    return NextResponse.json({ data: null, message: "Failed to create category", error: error.message }, { status: 500 });
  }
}

export async function GET() {
  try {
    const categories = await prisma.categories.findMany({ orderBy: { createdAt: "desc" } });
    return NextResponse.json({ data: categories, message: "Categories fetched successfully" });
  } catch (error) {
    console.error("GET /api/categories failed:", error);
    return NextResponse.json({ data: null, message: "Failed to fetch categories", error: error.message }, { status: 500 });
  }
}
