import { prisma } from "@/lib/prismadb";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  try {
    const { slug } = params;

    // Fetch product with farmer and category
    const product = await prisma.product.findUnique({
      where: { slug },
      include: {
        category: true, // include category object
        farmer: true,   // include farmer object
      },
    });

    if (!product) {
      return NextResponse.json({
        success: false,
        message: "Product not found",
      });
    }

    // Prepare product data for frontend
    const productData = {
      ...product,
      phoneNumber: product.phoneNumber || "Not provided",
      categoryName: product.category?.title || "Uncategorized",
      farmerName: product.farmer?.name || "Unknown",
    };

    return NextResponse.json({
      success: true,
      data: productData,
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
