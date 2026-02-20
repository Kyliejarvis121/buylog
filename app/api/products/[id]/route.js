import { prisma } from "@/lib/prismadb";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

/* =====================================================
   GET PRODUCT
===================================================== */
export async function GET(req, { params }) {
  try {
    const { id } = params;
    if (!id) return NextResponse.json({ success: false, message: "Product ID is required" }, { status: 400 });

    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        productImages: true,
        tags: true,
      },
    });

    if (!product) return NextResponse.json({ success: false, message: "Product not found" }, { status: 404 });

    return NextResponse.json({ success: true, data: product });
  } catch (error) {
    console.error("❌ GLOBAL PRODUCT GET ERROR:", error);
    return NextResponse.json({ success: false, message: "Failed to load product" }, { status: 500 });
  }
}

/* =====================================================
   DELETE PRODUCT (ADMIN ONLY)
===================================================== */
export async function DELETE(req, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ success: false, message: "Admin access required" }, { status: 403 });
    }

    const { id } = params;
    if (!id) return NextResponse.json({ success: false, message: "Product ID is required" }, { status: 400 });

    const product = await prisma.product.findUnique({ where: { id } });
    if (!product) return NextResponse.json({ success: false, message: "Product not found" }, { status: 404 });

    await prisma.$transaction([
      prisma.chat.deleteMany({ where: { productId: id } }),
      prisma.product.delete({ where: { id } }),
    ]);

    return NextResponse.json({ success: true, message: "Product deleted successfully" });
  } catch (error) {
    console.error("❌ GLOBAL PRODUCT DELETE ERROR:", error);
    return NextResponse.json({ success: false, message: "Failed to delete product" }, { status: 500 });
  }
}
