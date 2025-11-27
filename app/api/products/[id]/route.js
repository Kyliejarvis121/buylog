import { prisma } from "@/lib/prismadb";
import { NextResponse } from "next/server";

// GET a single product
export async function GET(request, { params: { id } }) {
  try {
    const product = await prisma.product.findUnique({ where: { id }, include: { category: true, vendor: true } });
    if (!product) return NextResponse.json({ data: null, message: "Product not found" }, { status: 404 });
    return NextResponse.json({ data: product });
  } catch (error) {
    return NextResponse.json({ message: "Failed to fetch product", error: error.message }, { status: 500 });
  }
}

// PUT update a product
export async function PUT(request, { params: { id } }) {
  try {
    const data = await request.json();
    const updatedProduct = await prisma.product.update({ where: { id }, data });
    return NextResponse.json({ data: updatedProduct, message: "Product updated" });
  } catch (error) {
    return NextResponse.json({ message: "Failed to update product", error: error.message }, { status: 500 });
  }
}

// DELETE a product
export async function DELETE(request, { params: { id } }) {
  try {
    const deleted = await prisma.product.delete({ where: { id } });
    return NextResponse.json({ data: deleted, message: "Product deleted" });
  } catch (error) {
    return NextResponse.json({ message: "Failed to delete product", error: error.message }, { status: 500 });
  }
}
