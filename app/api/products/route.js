// app/api/products/route.js
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prismadb";

function toNumberSafe(val, fallback = 0) {
  if (val === undefined || val === null) return fallback;
  const n = Number(val);
  return Number.isFinite(n) ? n : fallback;
}

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
      productCode,
      isActive,
    } = body;

    if (!title || !slug || !price || !farmerId) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    const product = await prisma.product.create({
      data: {
        title,
        slug,
        description: description || null,
        price: toNumberSafe(price),
        salePrice: toNumberSafe(salePrice),
        productStock: toNumberSafe(productStock),
        imageUrl: imageUrl || (productImages?.[0] ?? null),
        productImages: Array.isArray(productImages) ? productImages : [],
        tags: Array.isArray(tags) ? tags : [],
        sku: sku || null,
        barcode: barcode || null,
        unit: unit || null,
        isWholesale: !!isWholesale,
        wholesalePrice: toNumberSafe(wholesalePrice),
        wholesaleQty: toNumberSafe(wholesaleQty),
        productCode: productCode || null,
        isActive: isActive !== undefined ? !!isActive : true,

        // ✅ Relations
        category: categoryId ? { connect: { id: categoryId } } : undefined,
        farmer: { connect: { id: farmerId } },
      },
    });

    return NextResponse.json({ success: true, data: product }, { status: 201 });
  } catch (error) {
    console.error("CREATE PRODUCT ERROR:", error);
    return NextResponse.json(
      { success: false, message: "Failed to create product", error: error.message },
      { status: 500 }
    );
  }
}

