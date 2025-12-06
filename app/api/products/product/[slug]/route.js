import { prisma } from "@/lib/prismadb";
import { NextResponse } from "next/server";

export async function GET(request, { params: { slug } }) {
  try {
    const product = await prisma.product.findUnique({
      where: { slug },
      include: { category: true, farmer: true },
    });
    return NextResponse.json({ success: true, data: product });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch product", error },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params: { id } }) {
  try {
    const existingProduct = await prisma.product.findUnique({ where: { id } });
    if (!existingProduct) {
      return NextResponse.json({ data: null, message: "Product Not Found" }, { status: 404 });
    }
    const deletedProduct = await prisma.product.delete({ where: { id } });
    return NextResponse.json({ success: true, data: deletedProduct });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "Failed to delete product", error },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params: { id } }) {
  try {
    const body = await request.json();
    const existingProduct = await prisma.product.findUnique({ where: { id } });
    if (!existingProduct) {
      return NextResponse.json({ data: null, message: "Product Not Found" }, { status: 404 });
    }
    const updatedProduct = await prisma.product.update({
      where: { id },
      data: {
        ...body,
        productPrice: parseFloat(body.productPrice),
        salePrice: parseFloat(body.salePrice),
        wholesalePrice: parseFloat(body.wholesalePrice),
        wholesaleQty: parseInt(body.wholesaleQty),
        productStock: parseInt(body.productStock),
        qty: parseInt(body.qty),
        userId: body.farmerId,
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
