import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(request, { params: { slug } }) {
  try {
    const category = await prisma.category.findUnique({
      where: { slug },
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
      {
        message: "Failed to Fetch Category",
        error: error.message || error,
      },
      { status: 500 }
    );
  }
}
