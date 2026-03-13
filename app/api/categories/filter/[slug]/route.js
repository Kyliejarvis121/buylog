// app/api/categories/[slug]/route.js
import { prisma } from "@/lib/prismadb";
import { NextResponse } from "next/server";

export async function GET(request, { params: { slug } }) {
  try {
    const category = await prisma.category.findUnique({
      where: { slug },
      include: {
        products: {
          where: { isActive: true },
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!category) {
      return NextResponse.json(
        { success: false, data: null, message: "Category not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: category,
      message: "Category fetched successfully",
    });
  } catch (error) {
    console.error("GET /api/categories/[slug] failed:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch category" },
      { status: 500 }
    );
  }
}
