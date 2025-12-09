import { prisma } from "@/lib/prismadb";
import { NextResponse } from "next/server";

// -----------------------------------
// GET ALL PRODUCTS
// -----------------------------------
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
    console.error("GET PRODUCTS ERROR:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch products" },
      { status: 500 }
    );
  }
}

// -----------------------------------
// CREATE NEW PRODUCT
// -----------------------------------
export async function POST(req) {
  try {
    const body = await req.json();

    const {
      title,
      slug,
      description,
      productPrice,
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

    // Required fields check
    if (!title || !productPrice || !farmerId) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    const newProduct = await prisma.product.create({
      data: {
        title,
        slug,
        description,
        productPrice: parseFloat(productPrice),
        salePrice: salePrice ? parseFloat(salePrice) : null,

        categoryId: categoryId || null,
        farmerId,

        productImages: productImages || [],
        tags: tags || [],

        isActive: isActive ?? true,
        isWholesale: isWholesale ?? false,

        wholesalePrice: wholesalePrice ? parseFloat(wholesalePrice) : null,
        wholesaleQty: wholesaleQty ? parseInt(wholesaleQty) : null,

        productStock: productStock ? parseInt(productStock) : 0,
        qty: qty ? parseInt(qty) : 0,

        productCode: productCode || "",
        sku: sku || "",
        barcode: barcode || "",
        unit: unit || "",
      },
    });

    return NextResponse.json({
      success: true,
      data: newProduct,
    });
  } catch (error) {
    console.error("CREATE PRODUCT ERROR:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Something went wrong" },
      { status: 500 }
    );
  }
}
