import { NextResponse } from "next/server";
import { prisma } from "@/lib/prismadb";

// GET SINGLE PRODUCT
export async function GET(req, { params }) {
  try {
    const { id } = params;

    const product = await prisma.product.findUnique({
      where: { id }
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
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}


// UPDATE PRODUCT
export async function PUT(req, { params }) {
  try {
    const { id } = params;
    const data = await req.json();

    const updated = await prisma.product.update({
      where: { id },
      data: {
        ...data,
        price: data.price ? Number(data.price) : undefined
      }
    });

    return NextResponse.json({
      success: true,
      message: "Product updated successfully",
      data: updated
    });

  } catch (error) {
    console.error("UPDATE PRODUCT ERROR:", error);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}


// DELETE PRODUCT
export async function DELETE(req, { params }) {
  try {
    const { id } = params;

    await prisma.product.delete({
      where: { id }
    });

    return NextResponse.json({
      success: true,
      message: "Product deleted successfully"
    });

  } catch (error) {
    console.error("DELETE PRODUCT ERROR:", error);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}
