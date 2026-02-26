import { prisma } from "@/lib/prismadb";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

// ==============================
// OPTIONS (Preflight)
// ==============================
export async function OPTIONS() {
  return NextResponse.json({}, { status: 200 });
}

// ==============================
// GET SINGLE PRODUCT (FOR EDIT)
// ==============================
export async function GET(req, { params }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const farmer = await prisma.farmer.findUnique({
      where: { userId: session.user.id },
    });

    if (!farmer) {
      return NextResponse.json(
        { success: false, message: "Farmer not found" },
        { status: 403 }
      );
    }

    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Product ID is required" },
        { status: 400 }
      );
    }

    const product = await prisma.product.findFirst({
      where: {
        id,
        farmerId: farmer.id,
      },
      include: {
        category: true, // optional but useful
      },
    });

    if (!product) {
      return NextResponse.json(
        { success: false, message: "Product not found or access denied" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        ...product,
        productImages: Array.isArray(product.productImages)
          ? product.productImages
          : [],
      },
    });
  } catch (error) {
    console.error("FARMER PRODUCT GET ERROR:", error);

    return NextResponse.json(
      { success: false, message: "Failed to fetch product" },
      { status: 500 }
    );
  }
}

// ==============================
// UPDATE PRODUCT
// ==============================
export async function PUT(req, { params }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const farmer = await prisma.farmer.findUnique({
      where: { userId: session.user.id },
    });

    if (!farmer) {
      return NextResponse.json(
        { success: false, message: "Farmer not found" },
        { status: 403 }
      );
    }

    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Product ID is required" },
        { status: 400 }
      );
    }

    const existingProduct = await prisma.product.findFirst({
      where: {
        id,
        farmerId: farmer.id,
      },
    });

    if (!existingProduct) {
      return NextResponse.json(
        { success: false, message: "Product not found or access denied" },
        { status: 404 }
      );
    }

    const body = await req.json();

    // ❌ Remove fields that must NOT be updated
    const {
      id: _removedId,
      createdAt,
      updatedAt,
      ...updateData
    } = body;

    const updatedProduct = await prisma.product.update({
      where: { id },
      data: {
        ...updateData,
        updatedAt: new Date(), // optional but good practice
      },
    });

    return NextResponse.json({
      success: true,
      message: "Product updated successfully",
      data: updatedProduct,
    });
  } catch (error) {
    console.error("FARMER PRODUCT UPDATE ERROR:", error);

    return NextResponse.json(
      { success: false, message: "Failed to update product" },
      { status: 500 }
    );
  }
}

// ==============================
// DELETE PRODUCT
// ==============================
export async function DELETE(req, { params }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const farmer = await prisma.farmer.findUnique({
      where: { userId: session.user.id },
    });

    if (!farmer) {
      return NextResponse.json(
        { success: false, message: "Farmer not found" },
        { status: 403 }
      );
    }

    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Product ID is required" },
        { status: 400 }
      );
    }

    const product = await prisma.product.findFirst({
      where: {
        id,
        farmerId: farmer.id,
      },
    });

    if (!product) {
      return NextResponse.json(
        { success: false, message: "Product not found or access denied" },
        { status: 404 }
      );
    }

    await prisma.$transaction([
      prisma.chat.deleteMany({
        where: { productId: id },
      }),
      prisma.product.delete({
        where: { id },
      }),
    ]);

    return NextResponse.json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.error("FARMER PRODUCT DELETE ERROR:", error);

    return NextResponse.json(
      { success: false, message: "Failed to delete product" },
      { status: 500 }
    );
  }
}