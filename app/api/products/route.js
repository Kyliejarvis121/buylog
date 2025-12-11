// app/api/products/route.js
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prismadb";

export async function POST(req) {
  try {
    const body = await req.json();

    const {
      title,
      slug,
      description,
      price,
      salePrice,
      productStock,
      categoryId,
      farmerId,
      imageUrl,
      productImages,
      tags,
      sku,
      barcode,
      unit,
      isWholesale,
      wholesalePrice,
      wholesaleQty,
      qty,
      isActive,
    } = body;

    // Prevent NaN
    const safeWholesaleQty = Number(wholesaleQty) || 0;
    const safeQty = Number(qty) || 0;

    if (!title || !slug || !price || !farmerId) {
      return NextResponse.json(
        { message: "Missing required fields", success: false },
        { status: 400 }
      );
    }

    const product = await prisma.product.create({
      data: {
        title,
        slug,
        description,
        price: Number(price),
        salePrice: Number(salePrice) || 0,
        productStock: Number(productStock) || 0,

        // IMPORTANT: THIS FIXES YOUR ERROR
        category: categoryId
          ? { connect: { id: categoryId } }
          : undefined,

        farmer: { connect: { id: farmerId } },

        imageUrl,
        productImages,
        tags,

        sku,
        barcode,
        unit,
        isWholesale,
        wholesalePrice: Number(wholesalePrice) || 0,
        wholesaleQty: safeWholesaleQty,
        qty: safeQty,
        isActive,
      },
    });

    return NextResponse.json({ success: true, data: product }, { status: 201 });
  } catch (error) {
    console.error("PRODUCTS POST ERROR:", error);
    return NextResponse.json(
      {
        message: "Server error",
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}
