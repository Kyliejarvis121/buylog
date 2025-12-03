import { NextResponse } from "next/server";
import { prisma } from "@/lib/prismadb";

export async function POST(req) {
  try {
    const data = await req.json();
    const { title, description, salePrice, productStock, isActive, farmerId, productImages } = data;

    // Validate required fields
    if (!title || !description || !salePrice || !productStock || !farmerId || !productImages) {
      return NextResponse.json({ success: false, message: "Missing required fields" }, { status: 400 });
    }

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

    return NextResponse.json({ success: true, data: product, message: "Product uploaded successfully" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, message: "Server error", error: error.message }, { status: 500 });
  }
}

