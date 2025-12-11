import { prisma } from "@/lib/prismadb";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  try {
    const { slug } = params;

    if (!slug) {
      return NextResponse.json(
        { success: false, message: "Product slug is required", data: null },
        { status: 400 }
      );
    }

    const product = await prisma.product.findUnique({
      where: { slug },
      include: {
        category: true,
        farmer: true,
      },
    });

    if (!product) {
      return NextResponse.json(
        { success: false, message: "Product not found", data: null },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: product, // MUST BE OBJECT, NOT ARRAY
    });
  } catch (error) {
    console.error("GET PRODUCT ERROR:", error);
    return NextResponse.json(
      { success: false, message: "Server error", error: error.message, data: null },
      { status: 500 }
    );
  }
}

