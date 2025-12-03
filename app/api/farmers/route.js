// app/api/farmers/route.js

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prismadb";

// CREATE PRODUCT (upload)
export async function POST(req) {
  try {
    const data = await req.json();
    const {
      title,
      description,
      salePrice,
      productStock,
      isActive,
      farmerId,
      productImages
    } = data;

    // VALIDATION
    if (!farmerId) {
      return NextResponse.json(
        { success: false, message: "Missing farmerId" },
        { status: 400 }
      );
    }

    if (!title || !description || !salePrice || !productStock) {
      return NextResponse.json(
        { success: false, message: "All fields are required" },
        { status: 400 }
      );
    }

    if (!productImages || productImages.length === 0) {
      return NextResponse.json(
        { success: false, message: "Please upload at least one product image" },
        { status: 400 }
      );
    }

    // CHECK FARMER EXISTS
    const farmer = await prisma.farmer.findUnique({
      where: { id: farmerId }
    });

    if (!farmer) {
      return NextResponse.json(
        { success: false, message: "Farmer not found" },
        { status: 404 }
      );
    }

    // CREATE PRODUCT
    const product = await prisma.product.create({
      data: {
        title,
        description,
        salePrice: Number(salePrice),
        productStock: Number(productStock),
        isActive: Boolean(isActive),
        images: productImages,
        farmerId
      }
    });

    return NextResponse.json({
      success: true,
      message: "Product uploaded successfully",
      data: product
    });
  } catch (error) {
    console.error("API ERROR:", error);
    return NextResponse.json(
      { success: false, message: "Server error uploading product" },
      { status: 500 }
    );
  }
}

// GET ALL PRODUCTS FOR DASHBOARD
export async function GET() {
  try {
    const products = await prisma.product.findMany({
      orderBy: { createdAt: "desc" },
      include: { farmer: true },
    });

    return NextResponse.json({
      success: true,
      data: products,
    });
  } catch (error) {
    console.error("FETCH ERROR:", error);
    return NextResponse.json(
      { success: false, message: "Error fetching products" },
      { status: 500 }
    );
  }
}
