// app/api/products/[id]/route.js
import { prisma } from "@/lib/prismadb";
import { NextResponse } from "next/server";

// GET a single product
export async function GET(request, { params }) {
  try {
    const { id } = params;
    const product = await prisma.product.findUnique({
      where: { id },
      include: { category: true, vendor: true }, // include related models if needed
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
export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const data = await request.json();
    const updatedProduct = await prisma.product.update({ where: { id }, data });
    return NextResponse.json({ data: updatedProduct, message: "Product updated" });
  } catch (error) {
    console.error("Failed to update product:", error);
    return NextResponse.json({ message: "Failed to update product", error: error.message }, { status: 500 });
  }
}

// DELETE a product
export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    const deletedProduct = await prisma.product.delete({ where: { id } });
    return NextResponse.json({ data: deletedProduct, message: "Product deleted" });
  } catch (error) {
    console.error("Failed to delete product:", error);
    return NextResponse.json({ message: "Failed to delete product", error: error.message }, { status: 500 });
  }
}
