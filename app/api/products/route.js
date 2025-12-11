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
      productImages,
      tags,
      productCode,
      isWholesale,
      wholesalePrice,
      wholesaleQty,
      isActive,
      unit,
      sku,
      barcode,
    } = body;

    if (!productImages || !Array.isArray(productImages) || productImages.length === 0) {
      return NextResponse.json({ success: false, message: "Upload at least one product image" });
    }

    const product = await prisma.product.create({
      data: {
        title,
        slug,
        description,
        price,
        salePrice,
        productStock,
        categoryId,
        farmerId,
        productImages, // ✅ MULTIPLE IMAGES
        imageUrl: productImages[0], // ✅ Primary Image
        tags,
        productCode,
        isWholesale,
        wholesalePrice,
        wholesaleQty,
        isActive,
        sku,
        barcode,
        unit,
      },
    });

    return NextResponse.json({ success: true, data: product });
  } catch (err) {
    console.error("PRODUCT POST ERROR:", err);
    return NextResponse.json({ success: false, message: "Server error" });
  }
}
