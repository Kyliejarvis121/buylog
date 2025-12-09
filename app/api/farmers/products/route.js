import { NextResponse } from "next/server";
import { prisma } from "@/lib/prismadb";

// CREATE NEW PRODUCT
export async function POST(req) {
  try {
    const body = await req.json();
    const { name, price, categoryId, description, imageUrl, farmerId } = body;

    // Validate required fields
    if (!name || !price || !categoryId || !farmerId) {
      return NextResponse.json(
        {
          success: false,
          message: "Missing required fields",
        },
        { status: 400 }
      );
    }

    // Create product
    const newProduct = await prisma.product.create({
      data: {
        name,
        price: parseFloat(price),
        description: description || "",
        imageUrl: imageUrl || null,
        categoryId,
        farmerId,
      },
    });

    return NextResponse.json({
      success: true,
      data: newProduct,
    });
  } catch (error) {
    console.error("PRODUCT ROUTE ERROR:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to create product",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
