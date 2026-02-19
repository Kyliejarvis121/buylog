// route.js - Farmer Product API
// Author: Darlington Itota

import { prisma } from "@/lib/prismadb";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

/**
 * Safe number parser
 */
function toNumber(val, fallback = 0) {
  if (val === undefined || val === null || val === "") return fallback;
  const num = Number(val);
  return Number.isFinite(num) ? num : fallback;
}

/* =====================================================
   GET PRODUCT BY ID
===================================================== */
export async function GET(req, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user)
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });

    const farmer = await prisma.farmer.findFirst({ where: { userId: session.user.id } });
    if (!farmer)
      return NextResponse.json({ success: false, message: "Farmer not found" }, { status: 403 });

    const { id } = params;
    if (!id)
      return NextResponse.json({ success: false, message: "Product ID is required" }, { status: 400 });

    const product = await prisma.product.findFirst({
      where: { id, farmerId: farmer.id },
      include: { category: true },
    });

    if (!product)
      return NextResponse.json({ success: false, message: "Product not found" }, { status: 404 });

    return NextResponse.json({ success: true, data: product });
  } catch (error) {
    console.error("❌ PRODUCT GET ERROR:", error);
    return NextResponse.json({ success: false, message: "Failed to fetch product" }, { status: 500 });
  }
}

/* =====================================================
   UPDATE PRODUCT
===================================================== */
export async function PUT(req, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user)
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });

    const farmer = await prisma.farmer.findFirst({ where: { userId: session.user.id } });
    if (!farmer)
      return NextResponse.json({ success: false, message: "Farmer not found" }, { status: 403 });

    const { id } = params;
    if (!id)
      return NextResponse.json({ success: false, message: "Product ID is required" }, { status: 400 });

    const body = await req.json();

    const productImages = body.productImages
      ? Array.isArray(body.productImages)
        ? body.productImages
        : [body.productImages]
      : [];

    const updated = await prisma.product.update({
      where: { id },
      data: {
        title: body.title || undefined,
        slug: body.slug || undefined,
        description: body.description || undefined,
        price: "price" in body ? toNumber(body.price) : undefined,
        salePrice: "salePrice" in body ? toNumber(body.salePrice) : undefined,
        productStock: "productStock" in body ? toNumber(body.productStock) : undefined,
        qty: "qty" in body ? toNumber(body.qty, 1) : undefined,
        sku: body.sku || undefined,
        barcode: body.barcode || undefined,
        unit: body.unit || undefined,
        productCode: body.productCode || undefined,
        isWholesale: "isWholesale" in body ? !!body.isWholesale : undefined,
        wholesalePrice: "wholesalePrice" in body ? toNumber(body.wholesalePrice) : undefined,
        wholesaleQty: "wholesaleQty" in body ? toNumber(body.wholesaleQty) : undefined,
        isActive: "isActive" in body ? !!body.isActive : undefined,
        imageUrl: body.imageUrl || productImages[0] || undefined,
        productImages,
        tags: Array.isArray(body.tags) ? body.tags : undefined,
        categoryId: body.categoryId || undefined,
      },
    });

    return NextResponse.json({ success: true, message: "Product updated successfully", data: updated });
  } catch (error) {
    console.error("❌ PRODUCT UPDATE ERROR:", error);
    return NextResponse.json({ success: false, message: "Failed to update product" }, { status: 500 });
  }
}

/* =====================================================
   DELETE PRODUCT
   Deletes related chats first to prevent P2014 error
===================================================== */
export async function DELETE(req, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user)
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });

    const farmer = await prisma.farmer.findFirst({ where: { userId: session.user.id } });
    if (!farmer)
      return NextResponse.json({ success: false, message: "Farmer not found" }, { status: 403 });

    const { id } = params;
    if (!id)
      return NextResponse.json({ success: false, message: "Product ID is required" }, { status: 400 });

    const product = await prisma.product.findFirst({ where: { id, farmerId: farmer.id } });
    if (!product)
      return NextResponse.json({ success: false, message: "Product not found or access denied" }, { status: 404 });

    // Delete related chats first to avoid Prisma P2014 error
    await prisma.chat.deleteMany({ where: { productId: id } });

    // Delete the product
    await prisma.product.delete({ where: { id } });

    return NextResponse.json({ success: true, message: "Product and related chats deleted successfully" });
  } catch (error) {
    console.error("❌ PRODUCT DELETE ERROR:", error);
    return NextResponse.json({ success: false, message: "Failed to delete product" }, { status: 500 });
  }
}
