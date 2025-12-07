import { prisma } from "@/lib/prismadb";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

// POST /api/products
export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "FARMER") {
      return NextResponse.json(
        { success: false, message: "Only farmers can upload products" },
        { status: 403 }
      );
    }

    const body = await req.json();

    // Validate required fields
    const requiredFields = ["title", "slug", "price"];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { success: false, message: `${field} is required` },
          { status: 400 }
        );
      }
    }

    // Check for duplicate slug
    const existing = await prisma.product.findUnique({ where: { slug: body.slug } });
    if (existing) {
      return NextResponse.json(
        { success: false, message: `Product with slug ${body.slug} already exists` },
        { status: 409 }
      );
    }

    const newProduct = await prisma.product.create({
      data: {
        title: body.title,
        slug: body.slug,
        price: Number(body.price),
        salePrice: body.salePrice ? Number(body.salePrice) : null,
        description: body.description || "",
        categoryId: body.categoryId || null,
        farmerId: session.user.id,
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
