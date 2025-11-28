import { prisma } from "@/lib/prismadb";
import { NextResponse } from "next/server";

// GET a single product
export async function GET(request, context) {
  try {
    const { id } = context.params; // ensure params exist
    if (!id) {
      return NextResponse.json({ data: null, message: "Product ID is required" }, { status: 400 });
    }

    const product = await prisma.product.findUnique({
      where: { id },
      include: { category: true }, // remove vendor if your schema has no vendor
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

// PUT update a product
export async function PUT(request, context) {
  try {
    const { id } = context.params;
    if (!id) {
      return NextResponse.json({ message: "Product ID is required" }, { status: 400 });
    }

    const data = await request.json();
    const updatedProduct = await prisma.product.update({ where: { id }, data });
    return NextResponse.json({ data: updatedProduct, message: "Product updated" });
  } catch (error) {
    console.error("Failed to update product:", error);
    return NextResponse.json({ message: "Failed to update product", error: error.message }, { status: 500 });
  }
}

// DELETE a product
export async function DELETE(request, context) {
  try {
    const { id } = context.params;
    if (!id) {
      return NextResponse.json({ message: "Product ID is required" }, { status: 400 });
    }

    const deletedProduct = await prisma.product.delete({ where: { id } });
    return NextResponse.json({ data: deletedProduct, message: "Product deleted" });
  } catch (error) {
    console.error("Failed to delete product:", error);
    return NextResponse.json({ message: "Failed to delete product", error: error.message }, { status: 500 });
  }
}
