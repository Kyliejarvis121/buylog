import { prisma } from "@/lib/prismadb";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  try {
    const { id } = params;
    if (!id)
      return NextResponse.json(
        { success: false, message: "Product ID is required" },
        { status: 400 }
      );

    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        category: true, // ok if null
        productImages: true, // ok if empty or null
      },
    });

    if (!product)
      return NextResponse.json(
        { success: false, message: "Product not found" },
        { status: 404 }
      );

    // Convert any nulls to empty arrays/objects to prevent frontend crash
    return NextResponse.json({
      success: true,
      data: {
        ...product,
        category: product.category ?? null,
        productImages: Array.isArray(product.productImages)
          ? product.productImages
          : [],
      },
    });
  } catch (err) {
    console.error("❌ GLOBAL PRODUCT GET ERROR:", err);
    return NextResponse.json(
      { success: false, message: "Failed to fetch product" },
      { status: 500 }
    );
  }
}
