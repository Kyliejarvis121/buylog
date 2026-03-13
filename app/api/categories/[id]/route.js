// Route: app/api/categories/[id]/route.js
import { prisma } from "@/lib/prismadb";
import { NextResponse } from "next/server";

// GET SINGLE CATEGORY
export async function GET(request, { params: { id } }) {
  try {
    const category = await prisma.category.findUnique({
      where: { id },
      include: { products: true },
    });

    if (!category) return NextResponse.json({ data: null, message: "Category not found" }, { status: 404 });

    return NextResponse.json({ data: category });
  } catch (error) {
    console.error("GET /api/categories/[id] failed:", error);
    return NextResponse.json({ data: null, message: "Failed to fetch category", error: error.message }, { status: 500 });
  }
}

// UPDATE CATEGORY
export async function PUT(request, { params: { id } }) {
  try {
    const { title, slug, imageUrl, description, isActive } = await request.json();

    const existingCategory = await prisma.category.findUnique({ where: { id } });
    if (!existingCategory) return NextResponse.json({ data: null, message: "Category not found" }, { status: 404 });

    const updatedCategory = await prisma.category.update({
      where: { id },
      data: { title, slug, imageUrl, description, isActive },
    });

    return NextResponse.json({ data: updatedCategory, message: "Category updated successfully" });
  } catch (error) {
    console.error("PUT /api/categories/[id] failed:", error);
    return NextResponse.json({ data: null, message: "Failed to update category", error: error.message }, { status: 500 });
  }
}

// DELETE CATEGORY
export async function DELETE(request, { params: { id } }) {
  try {
    const existingCategory = await prisma.category.findUnique({ where: { id } });
    if (!existingCategory) return NextResponse.json({ data: null, message: "Category not found" }, { status: 404 });

    const deletedCategory = await prisma.category.delete({ where: { id } });
    return NextResponse.json({ data: deletedCategory, message: "Category deleted successfully" });
  } catch (error) {
    console.error("DELETE /api/categories/[id] failed:", error);
    return NextResponse.json({ data: null, message: "Failed to delete category", error: error.message }, { status: 500 });
  }
}
