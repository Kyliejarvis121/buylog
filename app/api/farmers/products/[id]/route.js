import { prisma } from "@/lib/prismadb";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

// This route is for farmer DELETE / PUT actions
export async function DELETE(req, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user)
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );

    const farmer = await prisma.farmer.findFirst({
      where: { userId: session.user.id },
    });
    if (!farmer)
      return NextResponse.json(
        { success: false, message: "Farmer not found" },
        { status: 403 }
      );

    const { id } = params;
    if (!id)
      return NextResponse.json(
        { success: false, message: "Product ID is required" },
        { status: 400 }
      );

    const product = await prisma.product.findFirst({
      where: { id, farmerId: farmer.id },
    });
    if (!product)
      return NextResponse.json(
        { success: false, message: "Product not found or access denied" },
        { status: 404 }
      );

    // Delete related chats first to prevent P2014
    await prisma.$transaction([
      prisma.chat.deleteMany({ where: { productId: id } }),
      prisma.product.delete({ where: { id } }),
    ]);

    return NextResponse.json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.error("❌ FARMER PRODUCT DELETE ERROR:", error);
    return NextResponse.json(
      { success: false, message: "Failed to delete product" },
      { status: 500 }
    );
  }
}

// Optional: PUT for farmer update
export async function PUT(req, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user)
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );

    const farmer = await prisma.farmer.findFirst({
      where: { userId: session.user.id },
    });
    if (!farmer)
      return NextResponse.json(
        { success: false, message: "Farmer not found" },
        { status: 403 }
      );

    const { id } = params;
    if (!id)
      return NextResponse.json(
        { success: false, message: "Product ID is required" },
        { status: 400 }
      );

    const product = await prisma.product.findFirst({
      where: { id, farmerId: farmer.id },
    });
    if (!product)
      return NextResponse.json(
        { success: false, message: "Product not found or access denied" },
        { status: 404 }
      );

    const body = await req.json();
    const updatedProduct = await prisma.product.update({
      where: { id },
      data: body,
    });

    return NextResponse.json({
      success: true,
      message: "Product updated successfully",
      data: updatedProduct,
    });
  } catch (error) {
    console.error("❌ FARMER PRODUCT UPDATE ERROR:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update product" },
      { status: 500 }
    );
  }
}

