import { prisma } from "@/lib/prismadb";
import { NextResponse } from "next/server";

// POST /api/products
export async function POST(req) {
  try {
    const body = await req.json();

    if (!body.slug || !body.title || !body.price) {
      return NextResponse.json(
        { success: false, message: "Title, slug, and price are required" },
        { status: 400 }
      );
    }

    // Check if product already exists
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
        farmerId: body.farmerId || null,
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

    return NextResponse.json({ success: true, data: newProduct });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "Failed to create product", error: error.message },
      { status: 500 }
    );
  }
}

// GET /api/products
export async function GET(req) {
  try {
    const url = new URL(req.url);
    const categoryId = url.searchParams.get("catId");
    const sortBy = url.searchParams.get("sort");
    const min = url.searchParams.get("min");
    const max = url.searchParams.get("max");
    const page = parseInt(url.searchParams.get("page") || "1");
    const pageSize = 10;

    const where = {};

    if (categoryId) where.categoryId = categoryId;
    if (min || max) {
      where.price = {};
      if (min) where.price.gte = Number(min);
      if (max) where.price.lte = Number(max);
    }

    const products = await prisma.product.findMany({
      where,
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: sortBy ? { price: sortBy === "asc" ? "asc" : "desc" } : { createdAt: "desc" },
      include: { category: true, farmer: true },
    });

    return NextResponse.json({ success: true, data: products });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch products", error: error.message },
      { status: 500 }
    );
  }
}
