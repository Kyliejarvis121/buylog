import { prisma } from "@/lib/prismadb";
import { NextResponse } from "next/server";

export async function GET(request, { params: { id } }) {
  try {
    const product = await prisma.products.findUnique({
      where: { id },
    });
    return NextResponse.json(product);
  } catch (error) {
    console.error("Failed to fetch product:", error);
    return NextResponse.json(
      { message: "Failed to Fetch Product", error: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params: { id } }) {
  try {
    const existingProduct = await prisma.products.findUnique({
      where: { id },
    });
    if (!existingProduct) {
      return NextResponse.json(
        { data: null, message: "Product Not Found" },
        { status: 404 }
      );
    }
    const deletedProduct = await prisma.products.delete({
      where: { id },
    });
    return NextResponse.json(deletedProduct);
  } catch (error) {
    console.error("Failed to delete product:", error);
    return NextResponse.json(
      { message: "Failed to Delete Product", error: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params: { id } }) {
  try {
    const body = await request.json();
    const existingProduct = await prisma.products.findUnique({
      where: { id },
    });
    if (!existingProduct) {
      return NextResponse.json(
        { data: null, message: "Product Not Found" },
        { status: 404 }
      );
    }

    const updatedProduct = await prisma.products.update({
      where: { id },
      data: {
        barcode: body.barcode,
        category: body.categoryId ? { connect: { id: body.categoryId } } : undefined,
        description: body.description,
        user: body.farmerId ? { connect: { id: body.farmerId } } : undefined,
        imageUrl: body.imageUrl,
        isActive: body.isActive,
        isWholesale: body.isWholesale,
        productCode: body.productCode,
        productPrice: parseFloat(body.productPrice),
        salePrice: parseFloat(body.salePrice),
        sku: body.sku,
        slug: body.slug,
        tags: body.tags,
        title: body.title,
        unit: body.unit,
        wholesalePrice: parseFloat(body.wholesalePrice),
        wholesaleQty: parseInt(body.wholesaleQty),
        productStock: parseInt(body.productStock),
        qty: parseInt(body.qty),
      },
    });

    return NextResponse.json(updatedProduct);
  } catch (error) {
    console.error("Failed to update product:", error);
    return NextResponse.json(
      { message: "Failed to Update Product", error: error.message },
      { status: 500 }
    );
  }
}
