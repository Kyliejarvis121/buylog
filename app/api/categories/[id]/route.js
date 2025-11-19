import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(request, { params: { id } }) {
  try {
    const category = await prisma.category.findUnique({
      where: { id },
      include: { products: true },
    });

    if (!category) {
      return NextResponse.json(
        { data: null, message: "Category not found" },
        { status: 200 }
      );
    }

    return NextResponse.json({ data: category });
  } catch (error) {
    console.error("Failed to fetch category:", error);
    return NextResponse.json(
      { message: "Failed to Fetch Category", error: error.message || error },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params: { id } }) {
  try {
    const existingCategory = await prisma.category.findUnique({
      where: { id },
    });

    if (!existingCategory) {
      return NextResponse.json(
        { data: null, message: "Category Not Found" },
        { status: 404 }
      );
    }

    const deletedCategory = await prisma.category.delete({
      where: { id },
    });

    return NextResponse.json({ data: deletedCategory });
  } catch (error) {
    console.error("Failed to delete category:", error);
    return NextResponse.json(
      { message: "Failed to Delete Category", error: error.message || error },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params: { id } }) {
  try {
    const { title, slug, imageUrl, description, isActive } = await request.json();

    const existingCategory = await prisma.category.findUnique({
      where: { id },
    });

    if (!existingCategory) {
      return NextResponse.json(
        { data: null, message: "Category Not Found" },
        { status: 404 }
      );
    }

    const updatedCategory = await prisma.category.update({
      where: { id },
      data: { title, slug, imageUrl, description, isActive },
    });

    return NextResponse.json({ data: updatedCategory });
  } catch (error) {
    console.error("Failed to update category:", error);
    return NextResponse.json(
      { message: "Failed to Update Category", error: error.message || error },
      { status: 500 }
    );
  }
}
