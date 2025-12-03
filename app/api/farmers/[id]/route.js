import { NextResponse } from "next/server";
import { prisma } from "@/lib/prismadb";

// GET SINGLE PRODUCT
export async function GET(_, { params }) {
  const { id } = params;

  const product = await prisma.product.findUnique({
    where: { id },
  });

  if (!product) {
    return NextResponse.json(
      { success: false, message: "Product not found" },
      { status: 404 }
    );
  }

  return NextResponse.json({ success: true, data: product });
}

// UPDATE PRODUCT
export async function PUT(req, { params }) {
  const { id } = params;
  const data = await req.json();

  const updated = await prisma.product.update({
    where: { id },
    data,
  });

  return NextResponse.json({
    success: true,
    message: "Product updated successfully",
    data: updated,
  });
}

// DELETE PRODUCT
export async function DELETE(_, { params }) {
  const { id } = params;

  await prisma.product.delete({
    where: { id },
  });

  return NextResponse.json({
    success: true,
    message: "Product deleted successfully",
  });
}
