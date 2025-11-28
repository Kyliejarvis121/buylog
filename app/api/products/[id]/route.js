import { prisma } from "@/lib/prismadb";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";

// GET a single product
export async function GET(request, { params: { id } }) {
  try {
    if (!id) return NextResponse.json({ data: null, message: "Product ID is required" }, { status: 400 });

    const product = await prisma.product.findUnique({
      where: { id: new ObjectId(id) },
      // Remove include if causing $scalars errors. You can fetch relations separately if needed
      // include: { category: true, vendor: true },
    });

    if (!product) return NextResponse.json({ data: null, message: "Product not found" }, { status: 404 });
    return NextResponse.json({ data: product, success: true });
  } catch (error) {
    return NextResponse.json({ message: "Failed to fetch product", error: error instanceof Error ? error.message : String(error) }, { status: 500 });
  }
}

// PUT update a product
export async function PUT(request, { params: { id } }) {
  try {
    if (!id) return NextResponse.json({ data: null, message: "Product ID is required" }, { status: 400 });

    const data = await request.json();
    const updatedProduct = await prisma.product.update({
      where: { id: new ObjectId(id) },
      data,
    });

    return NextResponse.json({ data: updatedProduct, message: "Product updated", success: true });
  } catch (error) {
    return NextResponse.json({ message: "Failed to update product", error: error instanceof Error ? error.message : String(error) }, { status: 500 });
  }
}

// DELETE a product
export async function DELETE(request, { params: { id } }) {
  try {
    if (!id) return NextResponse.json({ data: null, message: "Product ID is required" }, { status: 400 });

    const deleted = await prisma.product.delete({
      where: { id: new ObjectId(id) },
    });

    return NextResponse.json({ data: deleted, message: "Product deleted", success: true });
  } catch (error) {
    return NextResponse.json({ message: "Failed to delete product", error: error instanceof Error ? error.message : String(error) }, { status: 500 });
  }
}
