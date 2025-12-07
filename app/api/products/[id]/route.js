import { prisma } from "@/lib/prismadb";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

// GET /api/products/[id]
export async function GET(req, { params: { id } }) {
  try {
    const product = await prisma.product.findUnique({
      where: { id },
    });
    if (!product) {
      return NextResponse.json({ message: "Product not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: product });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch product", error: error.message },
      { status: 500 }
    );
  }
}

// PUT /api/products/[id]
export async function PUT(req, { params: { id } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "FARMER") {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 403 }
      );
    }

    const existingProduct = await prisma.product.findUnique({ where: { id } });
    if (!existingProduct) {
      return NextResponse.json({ message: "Product not found" }, { status: 404 });
    }

    if (existingProduct.farmerId !== session.user.id) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const updatedProduct = await prisma.product.update({
      where: { id },
      data: {
        title: body.title,
        slug: body.slug,
        price: body.price ? Number(body.price) : existingProduct.price,
        salePrice: body.salePrice ? Number(body.salePrice) : existingProduct.salePrice,
        description: body.description || existingProduct.description,
        categoryId: body.categoryId || existingProduct.categoryId,
        imageUrl: body.productImages?.[0] || existingProduct.imageUrl,
        productImages: body.productImages || existingProduct.productImages,
        tags: body.tags || existingProduct.tags,
        isActive: body.isActive ?? existingProduct.isActive,
        isWholesale: body.isWholesale ?? existingProduct.isWholesale,
        wholesalePrice: body.wholesalePrice ? Number(body.wholesalePrice) : existingProduct.wholesalePrice,
        wholesaleQty: body.wholesaleQty ? Number(body.wholesaleQty) : existingProduct.wholesaleQty,
        productStock: body.productStock ? Number(body.productStock) : existingProduct.productStock,
        qty: body.qty ? Number(body.qty) : existingProduct.qty,
        productCode: body.productCode || existingProduct.productCode,
      },
    });

    return NextResponse.json({ success: true, data: updatedProduct });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "Failed to update product", error: error.message },
      { status: 500 }
    );
  }
}

// DELETE /api/products/[id]
export async function DELETE(req, { params: { id } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "FARMER") {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 403 }
      );
    }

    const product = await prisma.product.findUnique({ where: { id } });
    if (!product) return NextResponse.json({ message: "Product not found" }, { status: 404 });
    if (product.farmerId !== session.user.id) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    await prisma.product.delete({ where: { id } });
    return NextResponse.json({ success: true, message: "Product deleted" });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "Failed to delete product", error: error.message },
      { status: 500 }
    );
  }
}
