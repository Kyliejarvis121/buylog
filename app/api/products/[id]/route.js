import { NextResponse } from "next/server";
import { prisma } from "@/lib/prismadb";

export async function PUT(req, { params }) {
  try {
    const { id } = params;
    const body = await req.json();

    const {
      title,
      slug,
      description,
      price,
      categoryId,
      farmerId,
      imageUrl,
      productImages,
      isActive
    } = body;

    const updatedProduct = await prisma.product.update({
      where: { id },
      data: {
        title,
        slug,
        description,
        price: parseFloat(price),
        categoryId: categoryId || null,
        farmerId: farmerId || null,
        imageUrl,
        productImages: productImages ?? [],
        isActive: isActive ?? true,
      }
    });

    return NextResponse.json({
      message: "Product updated successfully",
      data: updatedProduct,
    });
  } catch (error) {
    console.error("Failed to update product:", error);
    return NextResponse.json(
      { message: "Failed to update product", error: error.message },
      { status: 500 }
    );
  }
}
