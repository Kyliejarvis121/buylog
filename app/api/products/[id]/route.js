// app/api/products/[id]/route.js
import { prisma } from "@/lib/prismadb";
import { NextResponse } from "next/server";

export async function PUT(req, { params: { id } }) {
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

    const existingProduct = await prisma.product.findUnique({
      where: { id },
    });

    if (!existingProduct) {
      return NextResponse.json({ success: false, message: "Product not found" }, { status: 404 });
    }

    // Prepare relations
    const category = categoryId ? { connect: { id: categoryId } } : undefined;
    const farmer = farmerId ? { connect: { id: farmerId } } : undefined;

    const updatedProduct = await prisma.product.update({
      where: { id },
      data: {
        title,
        slug,
        description,
        price: price ? Number(price) : existingProduct.price,
        salePrice: salePrice ? Number(salePrice) : existingProduct.salePrice,
        productStock: productStock !== undefined ? Number(productStock) : existingProduct.productStock,
        qty: qty !== undefined ? Number(qty) : existingProduct.qty,
        productCode,
        isActive: isActive !== undefined ? isActive : existingProduct.isActive,
        isWholesale: isWholesale !== undefined ? isWholesale : existingProduct.isWholesale,
        wholesalePrice: wholesalePrice ? Number(wholesalePrice) : existingProduct.wholesalePrice,
        wholesaleQty: wholesaleQty ? Number(wholesaleQty) : existingProduct.wholesaleQty,
        imageUrl: imageUrl || existingProduct.imageUrl,
        productImages: productImages || existingProduct.productImages,
        tags: tags || existingProduct.tags,
        category,
        farmer,
      },
    });

    return NextResponse.json({ success: true, data: updatedProduct });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "Failed to update product", error },
      { status: 500 }
    );
  }
}
