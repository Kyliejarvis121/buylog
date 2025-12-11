import { prisma } from "@/lib/prismadb";
import { NextResponse } from "next/server";

// =====================================================
// GET — Fetch ALL products (Admin + Public Homepage)
// =====================================================
export async function GET() {
  try {
    const products = await prisma.product.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        category: true,
        farmer: true,
      },
    });

    return NextResponse.json({
      success: true,
      data: products ?? [],
    });
  } catch (error) {
    console.error("PRODUCTS GET ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch products",
        error: error.message,
        data: [],
      },
      { status: 500 }
    );
  }
}

// =====================================================
// POST — Create New Product (Farmer or Admin)
// =====================================================
export async function POST(req) {
  try {
    const body = await req.json();

    // Ensure price-related fields NEVER become null
    const price = Number(body.price) || 0;
    const salePrice = body.salePrice ? Number(body.salePrice) : null;
    const wholesalePrice = body.wholesalePrice ? Number(body.wholesalePrice) : 0;
    const wholesaleQty = body.wholesaleQty ? Number(body.wholesaleQty) : 0;

    // Validate required fields
    if (!body.title) {
      return NextResponse.json(
        { success: false, message: "Product title is required" },
        { status: 400 }
      );
    }

    // Slug generator
    const productSlug = body.slug
      ? body.slug.toLowerCase().replace(/\s+/g, "-")
      : body.title.toLowerCase().replace(/\s+/g, "-");

    const newProduct = await prisma.product.create({
      data: {
        title: body.title,
        slug: productSlug,
        description: body.description || "",
        price,
        salePrice,
        productStock: Number(body.productStock) || 0,

        // Relations
        categoryId: body.categoryId || null,
        farmerId: body.farmerId || null,

        // Images
        imageUrl: body.imageUrl || "",
        productImages: body.productImages || [],

        tags: body.tags || [],
        productCode: body.productCode || "",

        // Wholesale
        isWholesale: body.isWholesale || false,
        wholesalePrice,
        wholesaleQty,

        // Status
        isActive: body.isActive ?? true,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Product created successfully",
      data: newProduct,
    });
  } catch (error) {
    console.error("PRODUCT CREATE ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to create product",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
