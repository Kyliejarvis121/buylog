import { NextResponse } from "next/server";
import { prisma } from "@/lib/prismadb";

export async function PUT(req, context) {
  try {
    const { id } = context.params;
    const data = await req.json();

    const existingProduct = await prisma.product.findUnique({ where: { id } });
    if (!existingProduct) return NextResponse.json({ message: "Product not found" }, { status: 404 });

    const updatedProduct = await prisma.product.update({
      where: { id },
      data: {
        ...data,
        price: data.price ? Number(data.price) : undefined,
        salePrice: data.salePrice ? Number(data.salePrice) : undefined,
        productStock: data.productStock ? Number(data.productStock) : undefined,
      }
    });

    return NextResponse.json({ success: true, data: updatedProduct, message: "Product updated" });

  } catch (error) {
    console.error("UPDATE PRODUCT ERROR:", error);
    return NextResponse.json({ success: false, message: "Server error updating product", error: error.message }, { status: 500 });
  }
}

export async function DELETE(req, context) {
  try {
    const { id } = context.params;

    const existingProduct = await prisma.product.findUnique({ where: { id } });
    if (!existingProduct) return NextResponse.json({ message: "Product not found" }, { status: 404 });

    await prisma.product.delete({ where: { id } });
    return NextResponse.json({ success: true, message: "Product deleted" });

  } catch (error) {
    console.error("DELETE PRODUCT ERROR:", error);
    return NextResponse.json({ success: false, message: "Server error deleting product", error: error.message }, { status: 500 });
  }
}
