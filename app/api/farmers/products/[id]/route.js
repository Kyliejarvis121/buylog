import { prisma } from "@/lib/prismadb";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

// Helper to safely convert to number
const toNumber = (v, d = null) =>
  v === undefined || v === null || v === "" ? d : Number(v);

/* =====================================================
   GET PRODUCT
===================================================== */
export async function GET(req, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) return NextResponse.json({ success: false }, { status: 401 });

    const farmer = await prisma.farmer.findFirst({ where: { userId: session.user.id } });
    if (!farmer) return NextResponse.json({ success: false }, { status: 403 });

    const product = await prisma.product.findFirst({
      where: { id: params.id, farmerId: farmer.id },
      include: { category: true },
    });

    if (!product) return NextResponse.json({ success: false, message: "Product not found" }, { status: 404 });

    return NextResponse.json({ success: true, data: product });
  } catch (error) {
    console.error("❌ FARMER PRODUCT GET ERROR:", error);
    return NextResponse.json({ success: false, message: "Failed to fetch product" }, { status: 500 });
  }
}

/* =====================================================
   UPDATE PRODUCT
===================================================== */
export async function PUT(req, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) return NextResponse.json({ success: false }, { status: 401 });

    const farmer = await prisma.farmer.findFirst({ where: { userId: session.user.id } });
    if (!farmer) return NextResponse.json({ success: false }, { status: 403 });

    const body = await req.json();

    // Normalize productImages to always be an array
    const productImages = body.productImages
      ? Array.isArray(body.productImages)
        ? body.productImages
        : [body.productImages]
      : [];

    const updated = await prisma.product.update({
      where: { id: params.id },
      data: {
        title: String(body.title || ""),
        slug: body.slug || undefined,
        description: body.description || "",
        price: toNumber(body.price, 0),
        salePrice: toNumber(body.salePrice),
        productStock: toNumber(body.productStock, 0),
        qty: toNumber(body.qty, 1),
        sku: body.sku || null,
        barcode: body.barcode || null,
        unit: body.unit || null,
        productCode: body.productCode || null,
        isWholesale: !!body.isWholesale,
        wholesalePrice: toNumber(body.wholesalePrice),
        wholesaleQty: toNumber(body.wholesaleQty),
        isActive: body.isActive ?? true,
        imageUrl: body.imageUrl || (productImages[0] ?? null), // default to first image if main not set
        productImages,
        tags: Array.isArray(body.tags) ? body.tags : [],
        categoryId: body.categoryId || undefined,
      },
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error("❌ FARMER PRODUCT UPDATE ERROR:", error);
    return NextResponse.json({ success: false, message: "Failed to update product" }, { status: 500 });
  }
}

/* =====================================================
   DELETE PRODUCT
===================================================== */
export async function DELETE(req, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) return NextResponse.json({ success: false }, { status: 401 });

    const farmer = await prisma.farmer.findFirst({ where: { userId: session.user.id } });
    if (!farmer) return NextResponse.json({ success: false }, { status: 403 });

    await prisma.product.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true, message: "Product deleted successfully" });
  } catch (error) {
    console.error("❌ FARMER PRODUCT DELETE ERROR:", error);
    return NextResponse.json({ success: false, message: "Failed to delete product" }, { status: 500 });
  }
}
