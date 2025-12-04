// app/api/products/route.js
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prismadb";

// CREATE PRODUCT
export async function POST(req) {
  try {
    const {
      title,
      description,
      price,
      categoryId,
      farmerId,
      productImages,
      isActive
    } = await req.json();

    // VALIDATION
    if (!title || !price || !farmerId) {
      return NextResponse.json(
        { success: false, message: "title, price and farmerId are required" },
        { status: 400 }
      );
    }

    if (!productImages || productImages.length === 0) {
      return NextResponse.json(
        { success: false, message: "Please upload at least one image" },
        { status: 400 }
      );
    }

    const product = await prisma.product.create({
      data: {
        title,
        description,
        price: Number(price),
        categoryId: categoryId || null,
        farmerId,
        productImages,
        isActive: isActive === true || isActive === "true"
      }
    });

    return NextResponse.json({
      success: true,
      message: "Product created successfully",
      data: product
    });

  } catch (error) {
    console.error("PRODUCT CREATE ERROR:", error);
    return NextResponse.json(
      { success: false, message: "Server error creating product" },
      { status: 500 }
    );
  }
}


// GET ALL PRODUCTS
export async function GET() {
  try {
    const products = await prisma.product.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        category: true
      }
    });

    return NextResponse.json({
      success: true,
      data: products
    });

  } catch (error) {
    console.error("FETCH PRODUCT ERROR:", error);
    return NextResponse.json(
      { success: false, message: "Server error fetching products" },
      { status: 500 }
    );
  }
}
