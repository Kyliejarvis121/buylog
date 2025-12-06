import { prisma } from "@/lib/prismadb";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const body = await request.json();

    // Check if product exists
    const existingProduct = await prisma.product.findUnique({
      where: { slug: body.slug },
    });

    if (existingProduct) {
      return NextResponse.json(
        { data: null, message: `Product (${body.title}) already exists` },
        { status: 409 }
      );
    }

    const newProduct = await prisma.product.create({
      data: {
        ...body,
        userId: body.farmerId,
        productPrice: parseFloat(body.productPrice),
        salePrice: parseFloat(body.salePrice),
        wholesalePrice: parseFloat(body.wholesalePrice),
        wholesaleQty: parseInt(body.wholesaleQty),
        productStock: parseInt(body.productStock),
        qty: parseInt(body.qty),
        imageUrl: body.productImages[0],
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
    const sortBy = url.searchParams.get("sort");
    const min = url.searchParams.get("min");
    const max = url.searchParams.get("max");
    const page = parseInt(url.searchParams.get("page") || "1");
    const pageSize = 3;

    // ❌ Removed :any
    const where = categoryId ? { categoryId } : {};

    if (min || max) {
      where.salePrice = {};
      if (min) where.salePrice.gte = parseFloat(min);
      if (max) where.salePrice.lte = parseFloat(max);
    }

    const products = await prisma.product.findMany({
      where,
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: sortBy
        ? { salePrice: sortBy === "asc" ? "asc" : "desc" }
        : { createdAt: "desc" },
      include: {
        category: true,
        farmer: true,
      },
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
