// app/api/products/route.js
import { prisma } from "@/lib/prismadb";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const {
      title,
      slug,
      description,
      price,
      salePrice,
      productStock,
      qty,
      productCode,
      categoryId,
      farmerId,
      imageUrl,
      productImages,
      tags,
      isActive,
      isWholesale,
      wholesalePrice,
      wholesaleQty,
    } = await req.json();

    // Ensure category and farmer exist
    const category = categoryId ? { connect: { id: categoryId } } : undefined;
    const farmer = farmerId ? { connect: { id: farmerId } } : undefined;

    const newProduct = await prisma.product.create({
      data: {
        title,
        slug,
        description,
        price: Number(price),
        salePrice: salePrice ? Number(salePrice) : null,
        productStock: productStock ? Number(productStock) : 0,
        qty: qty ? Number(qty) : 0,
        productCode,
        isActive: isActive ?? true,
        isWholesale: isWholesale ?? false,
        wholesalePrice: wholesalePrice ? Number(wholesalePrice) : null,
        wholesaleQty: wholesaleQty ? Number(wholesaleQty) : null,
        imageUrl,
        productImages: productImages || [],
        tags: tags || [],
        category,
        farmer,
      },
    });

    return NextResponse.json({ success: true, data: newProduct });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, message: "Failed to create product", error }, { status: 500 });
  }
}
