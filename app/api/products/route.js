// app/api/products/route.js
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prismadb";

function toNumberSafe(val, fallback = undefined) {
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
      return NextResponse.json({ success: false, message: "Missing required fields" }, { status: 400 });
    }

    const product = await prisma.product.create({
      data: {
        title,
        slug,
        description: description || null,
        price: toNumberSafe(price, 0),
        salePrice: toNumberSafe(salePrice, 0),
        productStock: toNumberSafe(productStock, 0),
        categoryId: categoryId || null,
        farmerId,
        imageUrl: imageUrl || (productImages?.[0] ?? null),
        productImages: Array.isArray(productImages) ? productImages : [],
        tags: Array.isArray(tags) ? tags : [],
        sku: sku || null,
        barcode: barcode || null,
        unit: unit || null,
        isWholesale: !!isWholesale,
        wholesalePrice: toNumberSafe(wholesalePrice, 0),
        wholesaleQty: toNumberSafe(wholesaleQty, 0),
        productCode: productCode || null,
        isActive: isActive !== undefined ? !!isActive : true,
      },
    });

    return NextResponse.json({ success: true, data: product }, { status: 201 });
  } catch (error) {
    console.error("CREATE PRODUCT ERROR:", error);
    return NextResponse.json({ success: false, message: "Failed to create product", error: error.message }, { status: 500 });
  }
}

