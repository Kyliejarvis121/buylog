import { prisma } from "@/lib/prismadb";
import { NextResponse } from "next/server";

// CREATE NEW PRODUCT
export async function POST(req) {
  try {
    const body = await req.json();

    const {
      title,
      slug,
      description,
      price,
      salePrice,
      categoryId,
      farmerId,
      productImages,
      tags,
      isActive,
      isWholesale,
      wholesalePrice,
      wholesaleQty,
      productStock,
      qty,
      productCode,
      sku,
      barcode,
      unit,
    } = body;

    if (!title || !price || !farmerId) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Ensure productImages is an array
    const imagesArray = Array.isArray(productImages)
      ? productImages
      : productImages
      ? [productImages]
      : [];

    // Connect category if exists
    const categoryConnect = categoryId
      ? { connect: { id: categoryId } }
      : undefined;

    const newProduct = await prisma.product.create({
      data: {
        title,
        slug: slug || title.toLowerCase().replace(/\s+/g, "-"),
        description: description || "",
        price: parseFloat(price),
        salePrice: salePrice ? parseFloat(salePrice) : null,
        productStock: productStock ? parseInt(productStock) : 0,
        qty: qty ? parseInt(qty) : 1,
        productCode: productCode || "",
        sku: sku || "",
        barcode: barcode || "",
        unit: unit || "",
        imageUrl: imagesArray[0] || null,
        productImages: imagesArray,
        tags: tags || [],
        isActive: isActive ?? true,
        isWholesale: isWholesale ?? false,
        wholesalePrice: wholesalePrice ? parseFloat(wholesalePrice) : 0,
        wholesaleQty: wholesaleQty ? parseInt(wholesaleQty) : 0,
        farmer: { connect: { id: farmerId } },
        category: categoryConnect,
      },
    });

    return NextResponse.json({ success: true, data: newProduct }, { status: 201 });
  } catch (error) {
    console.error("CREATE PRODUCT ERROR:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to create product" },
      { status: 500 }
    );
  }
}

// GET ALL PRODUCTS
export async function GET(req) {
  try {
    const url = new URL(req.url);
    const q = url.searchParams.get("q") || "";
    const limit = parseInt(url.searchParams.get("limit") || "50");

    const products = await prisma.product.findMany({
      where: {
        OR: [
          { title: { contains: q, mode: "insensitive" } },
          { description: { contains: q, mode: "insensitive" } },
        ],
      },
      orderBy: { createdAt: "desc" },
      take: limit,
      include: { category: true, farmer: true },
    });

    return NextResponse.json({ success: true, data: products });
  } catch (error) {
    console.error("GET PRODUCTS ERROR:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch products", error: error.message },
      { status: 500 }
    );
  }
}

