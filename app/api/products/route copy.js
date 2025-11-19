import { prisma } from "@/lib/prismadb";
import { NextResponse } from "next/server";

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

    // Check if product exists
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
        category: categoryId,
        description,
        userId: farmerId,
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

    return NextResponse.json(newProduct);
  } catch (error) {
    console.error("Failed to create product:", error);
    return NextResponse.json(
      { message: "Failed to create Product", error: error.message },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  const categoryId = request.nextUrl.searchParams.get("catId");
  const sortBy = request.nextUrl.searchParams.get("sort");
  const min = request.nextUrl.searchParams.get("min");
  const max = request.nextUrl.searchParams.get("max");
  const page = parseInt(request.nextUrl.searchParams.get("page") || "1");
  const pageSize = 3;

  let where = {};
  if (categoryId) where.category = categoryId;

  if (min && max) {
    where.salePrice = { gte: parseFloat(min), lte: parseFloat(max) };
  } else if (min) {
    where.salePrice = { gte: parseFloat(min) };
  } else if (max) {
    where.salePrice = { lte: parseFloat(max) };
  }

  try {
    const products = await prisma.products.findMany({
      where,
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: sortBy === "asc" ? { salePrice: "asc" } : { createdAt: "desc" },
    });

    return NextResponse.json(products);
  } catch (error) {
    console.error("Failed to fetch products:", error);
    return NextResponse.json(
      { message: "Failed to Fetch Products", error: error.message },
      { status: 500 }
    );
  }
}
