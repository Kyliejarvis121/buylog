import { prisma } from "@/lib/prismadb";
import { NextResponse } from "next/server";

// GET product by ID
export async function GET(request, { params }) {
  const { id } = params;

  if (!id) {
    return NextResponse.json({ message: "Product ID is required" }, { status: 400 });
  }

  try {
    const product = await prisma.product.findUnique({ where: { id } });

    if (!product) {
      return NextResponse.json(
        { data: null, message: "Product not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ data: product });
  } catch (error) {
    console.error("GET PRODUCT ERROR:", error);
    return NextResponse.json({ message: "Failed to fetch product" }, { status: 500 });
  }
}


// UPDATE product by ID
export async function PUT(request, { params }) {
  const { id } = params;

  try {
    const data = await request.json();

    const updatedProduct = await prisma.product.update({
      where: { id },
      data: {
        title: data.title,
        description: data.description,
        salePrice: data.salePrice ? Number(data.salePrice) : undefined,
        productStock: data.productStock ? Number(data.productStock) : undefined,
        isActive: data.isActive,
        images: data.productImages || [],
        categoryId: data.categoryId,
        farmerId: data.farmerId,
      },
    });

    return NextResponse.json({
      data: updatedProduct,
      message: "Product updated successfully"
    });
  } catch (error) {
    console.error("UPDATE PRODUCT ERROR:", error);
    return NextResponse.json({ message: "Failed to update product" }, { status: 500 });
  }
}


// DELETE product by ID
export async function DELETE(request, { params }) {
  const { id } = params;

  try {
    await prisma.product.delete({ where: { id } });

    return NextResponse.json({
      message: "Product deleted successfully"
    });
  } catch (error) {
    console.error("DELETE PRODUCT ERROR:", error);
    return NextResponse.json({ message: "Failed to delete product" }, { status: 500 });
  }
}
