import { prisma } from "@/lib/prismadb";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

// POST /api/products
export async function POST(req) {
  try {
    // Get session
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json(
        { success: false, message: "You must be logged in to upload products" },
        { status: 401 }
      );
    }

    // Only FARMER can create products
    if (session.user.role !== "FARMER") {
      return NextResponse.json(
        { success: false, message: "Only farmers can upload products" },
        { status: 403 }
      );
    }

    // Parse request body
    const body = await req.json();

    if (!body.slug || !body.title || !body.price) {
      return NextResponse.json(
        { success: false, message: "Title, slug, and price are required" },
        { status: 400 }
      );
    }

    // Check for existing product
    const existingProduct = await prisma.product.findUnique({
      where: { slug: body.slug },
    });

    if (existingProduct) {
      return NextResponse.json(
        { success: false, message: `Product (${body.title}) already exists` },
        { status: 409 }
      );
    }

    // Create product
    const newProduct = await prisma.product.create({
      data: {
        title: body.title,
        slug: body.slug,
        price: Number(body.price),
        salePrice: body.salePrice ? Number(body.salePrice) : null,
        description: body.description || "",
        categoryId: body.categoryId || null,
        farmerId: session.user.id, // logged-in farmer
        imageUrl: body.productImages?.[0] || "",
        productImages: body.productImages || [],
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
    console.error(error);
    return NextResponse.json(
      { success: false, message: "Failed to create product", error: error.message },
      { status: 500 }
    );
  }
}
