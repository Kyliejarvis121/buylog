import { prisma } from "@/lib/prismadb";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Product ID is required" },
        { status: 400 }
      );
    }

    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        farmer: true,
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
      data: {
        ...product,
        productImages: product.productImages || [],
      },
    });
  } catch (error) {
    console.error("PRODUCT GET ERROR:", error);

    return NextResponse.json(
      { success: false, message: "Failed to fetch product" },
      { status: 500 }
    );
  }
}