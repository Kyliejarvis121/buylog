import { prisma } from "@/lib/prismadb";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  try {
    const { slug } = params;

    // Fetch product with farmer and category
    const product = await prisma.product.findUnique({
      where: { slug },
      include: {
        category: true,
        farmer: true,
      },
    });

    if (!product) {
      return NextResponse.json({
        success: false,
        message: "Product not found",
      });
    }

    // Return product including phone number
    return NextResponse.json({
      success: true,
      data: {
        ...product,
        phoneNumber: product.phoneNumber || null,
      },
    });
  } catch (error) {
    console.error("PRODUCT GET ERROR:", error);
    return NextResponse.json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
}
