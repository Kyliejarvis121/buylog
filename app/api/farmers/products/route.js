import { NextResponse } from "next/server";
import { prisma } from "@/lib/prismadb";

// CREATE PRODUCT
export async function POST(req) {
  try {
    const body = await req.json();

    const {
      title,
      slug,
      description,
      productPrice,
      salePrice,
      categoryId,
      farmerId,
      productImages,
      tags,
      isActive,
      isWholesale,
      wholesalePrice,
      wholesaleQty,
      productStock,
      qty,
      sku,
      barcode,
      unit,
    } = body;

    // VALIDATION (must match real required fields)
    if (!title || !slug || !productPrice || !categoryId || !farmerId) {
      return NextResponse.json(
        {
          success: false,
          message: "Missing required fields",
        },
        { status: 400 }
      );
    }

    // CREATE PRODUCT
    const newProduct = await prisma.product.create({
      data: {
        title,
        slug,
        description: description || "",
        productPrice: Number(productPrice),
        salePrice: salePrice ? Number(salePrice) : null,
        categoryId,
        farmerId,

        productImages: productImages || [],
        tags: tags || [],

        isActive: isActive ?? true,
        isWholesale: isWholesale ?? false,
        wholesalePrice: wholesalePrice ? Number(wholesalePrice) : null,
        wholesaleQty: wholesaleQty ? Number(wholesaleQty) : null,

        productStock: Number(productStock) || 0,
        qty: Number(qty) || 1,

        sku: sku || "",
        barcode: barcode || "",
        unit: unit || "",
      },
    });

    return NextResponse.json({
      success: true,
      data: newProduct,
    });
  } catch (error) {
    console.error("CREATE PRODUCT ERROR:", error);
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
