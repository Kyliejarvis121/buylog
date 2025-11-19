import { prisma } from "@/lib/prismadb"; // ✅ Use Prisma singleton
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { title, slug, imageUrl, description, isActive } = await request.json();

    // Check if category already exists
    const existingCategory = await prisma.categories.findUnique({
      where: { slug },
    });

    if (existingCategory) {
      return NextResponse.json(
        {
          data: null,
          message: `Category (${title}) already exists`,
        },
        { status: 409 }
      );
    }

    // Create new category
    const newCategory = await prisma.categories.create({
      data: { title, slug, imageUrl, description, isActive },
    });

    return NextResponse.json(newCategory);
  } catch (error) {
    console.error("POST /api/categories failed:", error);
    return NextResponse.json(
      {
        message: "Failed to create category",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const categories = await prisma.categories.findMany({
      orderBy: { id: "desc" },
    });

    return NextResponse.json(categories);
  } catch (error) {
    console.error("GET /api/categories failed:", error);
    return NextResponse.json(
      {
        message: "Failed to fetch categories",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
