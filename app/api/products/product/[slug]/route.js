// app/api/products/product/[slug]/route.js
import { prisma } from "@/lib/prismadb";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  try {
    const { slug } = params;

    if (!slug) {
      return NextResponse.json(
        { success: false, message: "Product slug is required" },
        { status: 400 }
      );
    }

    const product = await prisma.product.findUnique({
      where: { slug },
      include: {
        category: true, // include category
        farmer: true,   // include farmer
      },
    });

    if (!product) {
      return NextResponse.json(
        { success: false, message: "Product not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: product,
    });
  } catch (error) {
    console.error("GET PRODUCT ERROR:", error);
    return NextResponse.json(
      { success: false, message: "Server error fetching product", error: error.message },
      { status: 500 }
    );
  }
}
