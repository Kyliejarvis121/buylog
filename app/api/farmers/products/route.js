import { NextResponse } from "next/server";
import { prisma } from "@/lib/prismadb";
import slugify from "slugify";

// CREATE PRODUCT (FARMER)
export async function POST(req) {
  try {
    const body = await req.json();

    const {
      title,
      description,
      productPrice,
      salePrice,
      categoryId,
      farmerId,
      productImages,
      tags,
      isWholesale,
      wholesalePrice,
      wholesaleQty,
      productStock,
      qty,
      sku,
      barcode,
      unit
    } = body;

    // Required fields
    if (!title || !productPrice || !categoryId || !farmerId) {
      return NextResponse.json(
        {
          success: false,
          message: "Missing required fields (title, price, category, farmer)",
        },
        { status: 400 }
      );
    }

    // Generate slug
    const slug = slugify(title, {
      lower: true,
      strict: true,
    });

    // Generate product code
    const timestamp = new Date()
      .toISOString()
      .replace(/[-:TZ.]/g, "")
      .slice(0, 14);

    const productCode = `LLP-${title.substring(0, 1).toUpperCase()}-${timestamp}`;

    // CREATE product
    const newProduct = await prisma.product.create({
      data: {
        title,
        slug,
        description: description || "",
        productPrice: parseFloat(productPrice),
        salePrice: salePrice ? parseFloat(salePrice) : null,
        categoryId,
        farmerId,

        // Images & tags
        productImages: productImages || [],
        tags: tags || [],

        productStock: productStock ? parseInt(productStock) : 0,
        qty: qty ? parseInt(qty) : 1,

        sku: sku || null,
        barcode: barcode || null,
        unit: unit || null,

        // Wholesale options
        isWholesale: Boolean(isWholesale),
        wholesalePrice: wholesalePrice ? parseFloat(wholesalePrice) : null,
        wholesaleQty: wholesaleQty ? parseInt(wholesaleQty) : null,

        productCode,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Farmer product created successfully",
        data: newProduct,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("FARMER PRODUCT CREATE ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to create farmer product",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

// GET all farmer products
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
      data: products,
    });
  } catch (error) {
    console.error("FETCH FARMER PRODUCTS ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch farmer products",
      },
      { status: 500 }
    );
  }
}
