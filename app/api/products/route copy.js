import db from "@/lib/db";
import { NextResponse } from "next/server";

const PAGE_SIZE = 3;

export async function POST(request) {
  try {
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
    } = await request.json();

    // Check if product already exists
    const existingProduct = await db.product.findUnique({ where: { slug } });
    if (existingProduct) {
      return NextResponse.json(
        { success: false, data: null, message: `Product (${title}) already exists` },
        { status: 409 }
      );
    }

    // Create new product
    const newProduct = await db.product.create({
      data: {
        barcode,
        categoryId,
        description,
        userId: farmerId,
        productImages,
        imageUrl: productImages?.[0] || "",
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

    return NextResponse.json({ success: true, data: newProduct });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "Failed to create product", error },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  try {
    const url = request.nextUrl;
    const categoryId = url.searchParams.get("catId");
    const sortBy = url.searchParams.get("sort") || "desc";
    const min = url.searchParams.get("min");
    const max = url.searchParams.get("max");
    const page = parseInt(url.searchParams.get("page") || "1");

    // Build where clause
    const where = {};
    if (categoryId) where.categoryId = categoryId;
    if (min || max) where.salePrice = {};
    if (min) where.salePrice.gte = parseFloat(min);
    if (max) where.salePrice.lte = parseFloat(max);

    // Fetch products
    const products = await db.product.findMany({
      where,
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
      orderBy: sortBy === "asc" ? { salePrice: "asc" } : { salePrice: "desc" },
    });

    return NextResponse.json({ success: true, data: products });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch products", error },
      { status: 500 }
    );
  }
}
