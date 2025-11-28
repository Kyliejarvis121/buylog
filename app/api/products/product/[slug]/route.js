import { prisma } from "@/lib/prismadb";
import { NextResponse } from "next/server";

// GET product by slug
export async function GET(request, context) {
  const { slug } = context.params;
  if (!slug) {
    return NextResponse.json({ message: "Slug is required" }, { status: 400 });
  }

  try {
    const product = await prisma.product.findUnique({
      where: { slug },
    });

    if (!product) {
      return NextResponse.json({ data: null, message: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({ data: product });
  } catch (error) {
    console.error("Failed to fetch product:", error);
    return NextResponse.json({ message: "Failed to fetch product", error: error.message }, { status: 500 });
  }
}

// DELETE product by id
export async function DELETE(request, context) {
  const { id } = context.params;
  if (!id) return NextResponse.json({ message: "Product ID is required" }, { status: 400 });

  try {
    const existingProduct = await prisma.product.findUnique({ where: { id } });
    if (!existingProduct) return NextResponse.json({ data: null, message: "Product not found" }, { status: 404 });

    const deletedProduct = await prisma.product.delete({ where: { id } });
    return NextResponse.json({ data: deletedProduct, message: "Product deleted" });
  } catch (error) {
    console.error("Failed to delete product:", error);
    return NextResponse.json({ message: "Failed to delete product", error: error.message }, { status: 500 });
  }
}

// PUT update product by id
export async function PUT(request, context) {
  const { id } = context.params;
  if (!id) return NextResponse.json({ message: "Product ID is required" }, { status: 400 });

  try {
    const body = await request.json();
    const existingProduct = await prisma.product.findUnique({ where: { id } });
    if (!existingProduct) return NextResponse.json({ data: null, message: "Product not found" }, { status: 404 });

    const updatedProduct = await prisma.product.update({
      where: { id },
      data: {
        title: body.title,
        slug: body.slug,
        description: body.description,
        categoryId: body.categoryId,
        price: parseFloat(body.productPrice || 0),
        imageUrl: body.imageUrl,
        productImages: body.productImages || [],
        isActive: body.isActive,
      },
    });

    return NextResponse.json({ data: updatedProduct, message: "Product updated" });
  } catch (error) {
    console.error("Failed to update product:", error);
    return NextResponse.json({ message: "Failed to update product", error: error.message }, { status: 500 });
  }
}
