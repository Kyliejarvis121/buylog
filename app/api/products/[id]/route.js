// app/api/products/[id]/route.js
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prismadb";

// GET product by ID
export async function GET(req, { params }) {
  try {
    const product = await prisma.product.findUnique({
      where: { id: params.id },
      include: {
        category: true,
        farmer: true
      }
    });

    if (!product) {
      return NextResponse.json(
        { success: false, message: "Product not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: product });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Error fetching product" },
      { status: 500 }
    );
  }
}

// UPDATE product
export async function PUT(req, { params }) {
  try {
    const data = await req.json();

    const updated = await prisma.product.update({
      where: { id: params.id },
      data
    });

    return NextResponse.json({
      success: true,
      data: updated,
      message: "Product updated successfully"
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Error updating product" },
      { status: 500 }
    );
  }
}

// DELETE product
export async function DELETE(req, { params }) {
  try {
    await prisma.product.delete({
      where: { id: params.id }
    });

    return NextResponse.json({
      success: true,
      message: "Product deleted successfully"
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Error deleting product" },
      { status: 500 }
    );
  }
}
