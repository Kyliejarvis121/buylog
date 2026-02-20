import { prisma } from "@/lib/prismadb";
import { NextResponse } from "next/server";

// This route is used by EditProductPage to fetch any product
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
        category: true,
        productImages: true, // if you store multiple images
      },
    });

    if (!product)
      return NextResponse.json(
        { success: false, message: "Product not found" },
        { status: 404 }
      );

    return NextResponse.json({ success: true, data: product });
  } catch (err) {
    console.error("❌ GLOBAL PRODUCT GET ERROR:", err);
    return NextResponse.json(
      { success: false, message: "Failed to fetch product" },
      { status: 500 }
    );
  }
}
