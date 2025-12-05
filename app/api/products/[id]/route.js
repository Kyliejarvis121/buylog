import { NextResponse } from "next/server";
import { prisma } from "@/lib/prismadb";
import slugify from "slugify";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

export async function GET(req, { params }) {
  const { id } = params;
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });

  try {
    const product = await prisma.product.findUnique({
      where: { id },
      include: { category: true, farmer: true },
    });
    if (!product) return NextResponse.json({ success: false, message: "Product not found" }, { status: 404 });

    return NextResponse.json({ success: true, data: product });
  } catch (error) {
    console.error("FETCH PRODUCT ERROR:", error);
    return NextResponse.json({ success: false, message: "Error fetching product" }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  const { id } = params;
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });

  const { role, id: userId } = session.user;

  try {
    const data = await req.json();
    const product = await prisma.product.findUnique({ where: { id } });
    if (!product) return NextResponse.json({ success: false, message: "Product not found" }, { status: 404 });

    // Farmers can only update their own products
    if (role === "FARMER") {
      const farmer = await prisma.farmer.findFirst({ where: { userId } });
      if (!farmer || farmer.id !== product.farmerId) {
        return NextResponse.json({ success: false, message: "Forbidden" }, { status: 403 });
      }
    }

    const slug = data.title ? slugify(data.title, { lower: true, strict: true }) : product.slug;

    const updatedProduct = await prisma.product.update({
      where: { id },
      data: {
        title: data.title || product.title,
        slug,
        description: data.description || product.description,
        price: data.productPrice ? Number(data.productPrice) : product.price,
        salePrice: data.wholesalePrice ? Number(data.wholesalePrice) : product.salePrice,
        categoryId: data.categoryId || product.categoryId,
        imageUrl: data.imageUrl || product.imageUrl,
        productImages: data.productImages || product.productImages,
        isActive: data.isActive !== undefined ? Boolean(data.isActive) : product.isActive,
      },
    });

    return NextResponse.json({ success: true, data: updatedProduct, message: "Product updated successfully" });
  } catch (error) {
    console.error("UPDATE PRODUCT ERROR:", error);
    return NextResponse.json({ success: false, message: "Server error updating product", error: error.message }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  const { id } = params;
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });

  const { role, id: userId } = session.user;

  try {
    const product = await prisma.product.findUnique({ where: { id } });
    if (!product) return NextResponse.json({ success: false, message: "Product not found" }, { status: 404 });

    // Farmers can only delete their own products
    if (role === "FARMER") {
      const farmer = await prisma.farmer.findFirst({ where: { userId } });
      if (!farmer || farmer.id !== product.farmerId) {
        return NextResponse.json({ success: false, message: "Forbidden" }, { status: 403 });
      }
    }

    await prisma.product.delete({ where: { id } });

    return NextResponse.json({ success: true, message: "Product deleted successfully" });
  } catch (error) {
    console.error("DELETE PRODUCT ERROR:", error);
    return NextResponse.json({ success: false, message: "Server error deleting product", error: error.message }, { status: 500 });
  }
}
