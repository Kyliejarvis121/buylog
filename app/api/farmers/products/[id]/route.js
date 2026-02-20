import { prisma } from "@/lib/prismadb";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

/* =====================================================
   GET PRODUCT (FARMER ONLY)
===================================================== */
export async function GET(req, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });

    const farmer = await prisma.farmer.findFirst({ where: { userId: session.user.id } });
    if (!farmer) return NextResponse.json({ success: false, message: "Farmer not found" }, { status: 403 });

    const { id } = params;
    if (!id) return NextResponse.json({ success: false, message: "Product ID is required" }, { status: 400 });

    const product = await prisma.product.findFirst({
      where: { id, farmerId: farmer.id },
      include: {
        category: true,
        productImages: true,
        tags: true,
      },
    });

    if (!product) return NextResponse.json({ success: false, message: "Product not found or access denied" }, { status: 404 });

    return NextResponse.json({ success: true, data: product });
  } catch (error) {
    console.error("❌ FARMER PRODUCT GET ERROR:", error);
    return NextResponse.json({ success: false, message: "Failed to load product" }, { status: 500 });
  }
}

/* =====================================================
   DELETE PRODUCT (FARMER ONLY)
===================================================== */
export async function DELETE(req, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });

    const farmer = await prisma.farmer.findFirst({ where: { userId: session.user.id } });
    if (!farmer) return NextResponse.json({ success: false, message: "Farmer not found" }, { status: 403 });

    const { id } = params;
    if (!id) return NextResponse.json({ success: false, message: "Product ID is required" }, { status: 400 });

    const product = await prisma.product.findFirst({ where: { id, farmerId: farmer.id } });
    if (!product) return NextResponse.json({ success: false, message: "Product not found or access denied" }, { status: 404 });

    await prisma.$transaction([
      prisma.chat.deleteMany({ where: { productId: id } }),
      prisma.product.delete({ where: { id } }),
    ]);

    return NextResponse.json({ success: true, message: "Product deleted successfully" });
  } catch (error) {
    console.error("❌ FARMER PRODUCT DELETE ERROR:", error);
    return NextResponse.json({ success: false, message: "Failed to delete product" }, { status: 500 });
  }
}
