// app/api/products/route.js
import { prisma } from "@/lib/prismadb";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json(
        { success: false, message: "You must be logged in to upload products" },
        { status: 401 }
      );
    }

    if (session.user.role !== "FARMER") {
      return NextResponse.json(
        { success: false, message: "Only farmers can upload products" },
        { status: 403 }
      );
    }

    const body = await req.json();

    // Required fields
    if (!body.slug || !body.title || !body.price) {
      return NextResponse.json(
        { success: false, message: "Title, slug, and price are required" },
        { status: 400 }
      );
    }

    // Prevent duplicate slug
    const existing = await prisma.product.findUnique({ where: { slug: body.slug } });
    if (existing) {
      return NextResponse.json(
        { success: false, message: `Product (${body.title}) already exists` },
        { status: 409 }
      );
    }

    const newProduct = await prisma.product.create({
      data: {
        title: body.title,
        slug: body.slug,
        description: body.description || "",
        price: Number(body.price),
        salePrice: body.salePrice ? Number(body.salePrice) : null,
        categoryId: body.categoryId || null,
        farmerId: session.user.id, // link to logged-in farmer
        productImages: body.productImages || [],
        imageUrl: body.productImages?.[0] || "",
        tags: body.tags || [],
        isActive: body.isActive ?? true,
        isWholesale: body.isWholesale ?? false,
        wholesalePrice: body.wholesalePrice ? Number(body.wholesalePrice) : null,
        wholesaleQty: body.wholesaleQty ? Number(body.wholesaleQty) : null,
        productStock: body.productStock ? Number(body.productStock) : 0,
        qty: body.qty ? Number(body.qty) : 0,
        productCode: body.productCode || null,
      },
    });

    return NextResponse.json({ success: true, data: newProduct }, { status: 201 });
  } catch (error) {
    console.error("PRODUCT CREATE ERROR:", error);
    return NextResponse.json(
      { success: false, message: "Failed to create product", error: error.message },
      { status: 500 }
    );
  }
}
