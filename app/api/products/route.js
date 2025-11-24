import { prisma } from "@/lib/prismadb";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const body = await request.json();

    const {
      barcode,
      categoryId,
      description,
      farmerId,
      isActive,
      isWholesale,
      productCode,
      productPrice,
      salePrice,
      sku,
      slug,
      tags,
      title,
      unit,
      wholesalePrice,
      wholesaleQty,
      productStock,
      qty,
      productImages,
    } = body;

    const existingProduct = await prisma.products.findUnique({
      where: { slug },
    });

    if (existingProduct) {
      return NextResponse.json(
        { data: null, message: `Product (${title}) already exists` },
        { status: 409 }
      );
    }

    const newProduct = await prisma.products.create({
      data: {
        barcode,
        categoryId,
        description,
        farmerId,
        productImages,
        imageUrl: productImages[0] || null,
        isActive,
        isWholesale,
        productCode,
        productPrice: parseFloat(productPrice),
        salePrice: parseFloat(salePrice),
        sku,
        slug,
        tags,
        title,
        unit,
        wholesalePrice: parseFloat(wholesalePrice),
        wholesaleQty: parseInt(wholesaleQty),
        productStock: parseInt(productStock),
        qty: parseInt(qty),
      },
    });

    return NextResponse.json({ data: newProduct, message: "Product created" });
  } catch (error) {
    console.error("POST /api/products failed:", error);
    return NextResponse.json(
      { message: "Failed to create product", error: error.message },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get("catId");
    const sortBy = searchParams.get("sort");
    const min = searchParams.get("min");
    const max = searchParams.get("max");
    const page = parseInt(searchParams.get("page") || "1");
    const pageSize = 3;

    let where = {};
    if (categoryId) where.categoryId = categoryId;
    if (min && max) where.salePrice = { gte: parseFloat(min), lte: parseFloat(max) };
    else if (min) where.salePrice = { gte: parseFloat(min) };
    else if (max) where.salePrice = { lte: parseFloat(max) };

    const products = await prisma.products.findMany({
      where,
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: sortBy === "asc" ? { salePrice: "asc" } : { createdAt: "desc" },
    });

    return NextResponse.json({ data: products, message: "Products fetched" });
  } catch (error) {
    console.error("GET /api/products failed:", error);
    return NextResponse.json(
      { message: "Failed to fetch products", error: error.message },
      { status: 500 }
    );
  }
}

