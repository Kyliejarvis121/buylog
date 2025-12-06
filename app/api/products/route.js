import { prisma } from "@/lib/prismadb";
import { NextResponse } from "next/server";

// Helper to parse numbers safely
function toNumber(value, fallback = 0) {
  if (!value) return fallback;
  return typeof value === "string" ? parseFloat(value) : value;
}

export async function POST(req) {
  try {
    const body = await req.json();

    // Validate required fields
    if (!body.title || !body.slug || !body.price) {
      return NextResponse.json(
        { success: false, message: "title, slug & price are required" },
        { status: 400 }
      );
    }

    // Check existing product
    const existing = await prisma.product.findUnique({
      where: { slug: body.slug },
    });

    if (existing) {
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
        price: toNumber(body.price),
        description: body.description || "",
        categoryId: body.categoryId || null,
        farmerId: body.farmerId || null,

        imageUrl: body.productImages?.[0] || "",
        productImages: body.productImages || [],
        tags: body.tags || [],

        isActive: body.isActive ?? true,
        isWholesale: body.isWholesale ?? false,

        wholesalePrice: body.wholesalePrice ? toNumber(body.wholesalePrice) : null,
        wholesaleQty: body.wholesaleQty ? toNumber(body.wholesaleQty) : null,

        productStock: toNumber(body.productStock, 0),
        qty: toNumber(body.qty, 0),

        productCode: body.productCode || null,
      },
    });

    return NextResponse.json({ success: true, data: newProduct });
  } catch (err) {
    console.error("POST /products error:", err);
    return NextResponse.json(
      { success: false, message: "Failed to create product", error: err.message },
      { status: 500 }
    );
  }
}

export async function GET(req) {
  try {
    const url = new URL(req.url);

    const categoryId = url.searchParams.get("catId");
    const sortBy = url.searchParams.get("sort");
    const min = url.searchParams.get("min");
    const max = url.searchParams.get("max");
    const page = Number(url.searchParams.get("page") || 1);
    const pageSize = 10;

    const where = {};

    if (categoryId) where.categoryId = categoryId;

    if (min || max) {
      where.price = {};
      if (min) where.price.gte = parseFloat(min);
      if (max) where.price.lte = parseFloat(max);
    }

    const products = await prisma.product.findMany({
      where,
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: sortBy
        ? { price: sortBy === "asc" ? "asc" : "desc" }
        : { createdAt: "desc" },
      include: {
        category: true,
        farmer: true,
      },
    });

    return NextResponse.json({ success: true, data: products });
  } catch (err) {
    console.error("GET /products error:", err);
    return NextResponse.json(
      { success: false, message: "Failed to fetch products", error: err.message },
      { status: 500 }
    );
  }
}
