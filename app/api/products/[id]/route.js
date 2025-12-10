import { NextResponse } from "next/server";
import { prisma } from "@/lib/prismadb";

// =============================
// GET ONE PRODUCT
// =============================
export async function GET(req, { params }) {
  try {
    const product = await prisma.product.findUnique({
      where: { id: params.id },
      include: {
        category: true,
        farmer: true,
      },
    });

    if (!product) {
      return NextResponse.json(
        { success: false, message: "Product not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: product });
  } catch (error) {
    console.error("GET PRODUCT ERROR:", error);
    return NextResponse.json(
      { success: false, message: "Error fetching product" },
      { status: 500 }
    );
  }
}

// =============================
// UPDATE PRODUCT
// =============================
export async function PUT(req, { params }) {
  try {
    const body = await req.json();

    const updated = await prisma.product.update({
      where: { id: params.id },
      data: {
        ...body,
        price: body.price ? parseFloat(body.price) : undefined,
        salePrice: body.salePrice ? parseFloat(body.salePrice) : undefined,
        productStock: body.productStock
          ? parseInt(body.productStock)
          : undefined,
        wholesalePrice: body.wholesalePrice
          ? parseFloat(body.wholesalePrice)
          : undefined,
        wholesaleQty: body.wholesaleQty
          ? parseInt(body.wholesaleQty)
          : undefined,

        category: body.categoryId
          ? { connect: { id: body.categoryId } }
          : undefined,

        farmer: body.farmerId ? { connect: { id: body.farmerId } } : undefined,
      },
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error("UPDATE PRODUCT ERROR:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update product" },
      { status: 500 }
    );
  }
}

// =============================
// DELETE PRODUCT
// =============================
export async function DELETE(req, { params }) {
  try {
    await prisma.product.delete({
      where: { id: params.id },
    });

    return NextResponse.json({
      success: true,
      message: "Product deleted",
    });
  } catch (error) {
    console.error("DELETE PRODUCT ERROR:", error);
    return NextResponse.json(
      { success: false, message: "Failed to delete product" },
      { status: 500 }
    );
  }
}
