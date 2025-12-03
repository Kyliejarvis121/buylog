// app/api/products/[id]/route.js
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prismadb";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

export const dynamic = "force-dynamic";
export const revalidate = 0;

function normalizeProductUpdate(body) {
  const out = {};
  if (body.title !== undefined) out.title = body.title;
  if (body.slug !== undefined) out.slug = body.slug;
  if (body.description !== undefined) out.description = body.description;
  if (body.price !== undefined) out.price = parseFloat(body.price);
  if (body.categoryId !== undefined) out.categoryId = body.categoryId || null;
  if (body.farmerId !== undefined) out.farmerId = body.farmerId || null;
  if (body.imageUrl !== undefined) out.imageUrl = body.imageUrl;
  if (body.productImages !== undefined) out.productImages = Array.isArray(body.productImages) ? body.productImages : [body.productImages];
  if (body.isActive !== undefined) out.isActive = Boolean(body.isActive);
  return out;
}

// GET single product
export async function GET(request, { params }) {
  try {
    const { id } = params;
    const product = await prisma.product.findUnique({ where: { id }, include: { category: true } });
    if (!product) return NextResponse.json({ success: false, message: "Product not found" }, { status: 404 });
    return NextResponse.json({ success: true, data: product });
  } catch (error) {
    console.error("GET /api/products/[id] error:", error);
    return NextResponse.json({ success: false, message: "Server error", error: error.message }, { status: 500 });
  }
}

// PUT update product
export async function PUT(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });

    const { id } = params;
    const body = await request.json();
    const updates = normalizeProductUpdate(body);

    const existing = await prisma.product.findUnique({ where: { id } });
    if (!existing) return NextResponse.json({ success: false, message: "Product not found" }, { status: 404 });

    // Permission: admin or owner farmer
    const role = session.user?.role;
    const userId = session.user?.id;
    if (role !== "ADMIN" && existing.farmerId !== userId) {
      return NextResponse.json({ success: false, message: "Forbidden" }, { status: 403 });
    }

    const updated = await prisma.product.update({
      where: { id },
      data: updates,
    });

    return NextResponse.json({ success: true, message: "Product updated", data: updated });
  } catch (error) {
    console.error("PUT /api/products/[id] error:", error);
    return NextResponse.json({ success: false, message: "Failed to update product", error: error.message }, { status: 500 });
  }
}

// DELETE product
export async function DELETE(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });

    const { id } = params;
    const existing = await prisma.product.findUnique({ where: { id } });
    if (!existing) return NextResponse.json({ success: false, message: "Product not found" }, { status: 404 });

    // Permission: admin or owner farmer
    const role = session.user?.role;
    const userId = session.user?.id;
    if (role !== "ADMIN" && existing.farmerId !== userId) {
      return NextResponse.json({ success: false, message: "Forbidden" }, { status: 403 });
    }

    await prisma.product.delete({ where: { id } });

    return NextResponse.json({ success: true, message: "Product deleted" });
  } catch (error) {
    console.error("DELETE /api/products/[id] error:", error);
    return NextResponse.json({ success: false, message: "Failed to delete product", error: error.message }, { status: 500 });
  }
}
