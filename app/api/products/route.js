export const dynamic = "force-dynamic";
export const revalidate = 0;

import { prisma } from "@/lib/prismadb";
import { NextResponse } from "next/server";

// CREATE PRODUCT
export async function POST(request) {
  try {
    const body = await request.json();

    if (!body.title || !body.farmerId) {
      return NextResponse.json(
        { success: false, message: "Title and farmerId are required" },
        { status: 400 }
      );
    }

    const product = await prisma.product.create({
      data: {
        title: body.title,
        slug: body.slug || body.title.toLowerCase().replace(/\s+/g, "-"),
        description: body.description || "",
        price: Number(body.price) || 0,
        salePrice: Number(body.salePrice) || 0,
        productStock: Number(body.productStock) || 0,
        qty: Number(body.qty) || 1,
        imageUrl: Array.isArray(body.productImages)
          ? body.productImages[0]
          : body.imageUrl,
        productImages: body.productImages || [],
        tags: body.tags || [],
        productCode: body.productCode || "",
        sku: body.sku || "",
        barcode: body.barcode || "",
        unit: body.unit || "",
        isWholesale: !!body.isWholesale,
        wholesalePrice: Number(body.wholesalePrice) || 0,
        wholesaleQty: Number(body.wholesaleQty) || 0,
        isActive: body.isActive ?? true,

        // ✅ Existing
        phoneNumber: body.phoneNumber || "",

        // ✅ NEW: Location
        location: body.location || "",

        farmer: { connect: { id: body.farmerId } },

        category: body.categoryId
          ? { connect: { id: body.categoryId } }
          : undefined,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Product created successfully",
        data: product,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/products failed:", error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Failed to create product",
      },
      { status: 500 }
    );
  }
}

// GET ALL PRODUCTS (with optional category filter)
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);

    const page = Number(searchParams.get("page") || 1);
    const limit = Number(searchParams.get("limit") || 1000);
    const skip = (page - 1) * limit;
    const searchQuery = searchParams.get("q")?.trim() || "";
    const categoryId = searchParams.get("categoryId") || "";

    // Build the where clause like your current code
    const where = {};
    if (searchQuery) {
      where.title = { contains: searchQuery, mode: "insensitive" };
    }
    if (categoryId) {
      where.categoryId = categoryId;
    }

    const products = await prisma.product.findMany({
      where: Object.keys(where).length ? where : undefined,
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
      include: { category: true, farmer: true },
    });

    const total = await prisma.product.count({
      where: Object.keys(where).length ? where : undefined,
    });

    return NextResponse.json({
      success: true,
      data: products,
      total,
      page,
      limit,
      message: `Fetched ${products.length} products out of ${total}`,
    });
  } catch (error) {
    console.error("GET /api/products failed:", error);
    return NextResponse.json({
      success: false,
      data: [],
      message: "Failed to fetch products",
      error: error.message,
    });
  }
}
