import { prisma } from "@/lib/prismadb";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

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

    await prisma.product.delete({
      where: {
        id: params.id,
        farmerId: farmer.id, // 🔒 ownership check
      },
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

    const product = await prisma.product.update({
      where: {
        id: params.id,
        farmerId: farmer.id,
      },
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
