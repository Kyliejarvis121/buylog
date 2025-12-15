import { prisma } from "@/lib/prismadb";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

/* ======================================================
   GET PRODUCT (FOR EDIT PAGE)
====================================================== */
export async function GET(req, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ success: false }, { status: 401 });
    }

    const farmer = await prisma.farmer.findFirst({
      where: { userId: session.user.id },
    });

    if (!farmer) {
      return NextResponse.json({ success: false }, { status: 403 });
    }

    const product = await prisma.product.findFirst({
      where: {
        id: params.id,
        farmerId: farmer.id, // 🔒 ownership check
      },
      include: {
        category: true,
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
      { success: false, message: "Failed to fetch product" },
      { status: 500 }
    );
  }
}

/* ======================================================
   UPDATE PRODUCT
====================================================== */
export async function PUT(req, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ success: false }, { status: 401 });
    }

    const farmer = await prisma.farmer.findFirst({
      where: { userId: session.user.id },
    });

    if (!farmer) {
      return NextResponse.json({ success: false }, { status: 403 });
    }

    const body = await req.json();

    // 🔒 Ensure ownership before update
    const existingProduct = await prisma.product.findFirst({
      where: {
        id: params.id,
        farmerId: farmer.id,
      },
    });

    if (!existingProduct) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 403 }
      );
    }

    const product = await prisma.product.update({
      where: { id: params.id },
      data: {
        title: body.title,
        price: Number(body.price),
        productStock: Number(body.productStock),
        isActive: body.isActive,
        categoryId: body.categoryId || null,
        imageUrl: body.imageUrl,
        productImages: body.productImages || [],
        tags: body.tags || [],
      },
    });

    return NextResponse.json({ success: true, data: product });
  } catch (error) {
    console.error("UPDATE PRODUCT ERROR:", error);
    return NextResponse.json(
      { success: false, message: "Update failed" },
      { status: 500 }
    );
  }
}

/* ======================================================
   DELETE PRODUCT
====================================================== */
export async function DELETE(req, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ success: false }, { status: 401 });
    }

    const farmer = await prisma.farmer.findFirst({
      where: { userId: session.user.id },
    });

    if (!farmer) {
      return NextResponse.json({ success: false }, { status: 403 });
    }

    // 🔒 Ownership check
    const product = await prisma.product.findFirst({
      where: {
        id: params.id,
        farmerId: farmer.id,
      },
    });

    if (!product) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 403 }
      );
    }

    await prisma.product.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE PRODUCT ERROR:", error);
    return NextResponse.json(
      { success: false, message: "Delete failed" },
      { status: 500 }
    );
  }
}
