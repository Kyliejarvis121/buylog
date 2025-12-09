import { prisma } from "@/lib/prismadb";
import { NextResponse } from "next/server";

// GET ALL PRODUCTS
export async function GET() {
  try {
    const products = await prisma.product.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        category: true,
        farmer: true,
      },
    });
    return NextResponse.json({ success: true, data: products });
  } catch (error) {
    console.error("GET PRODUCTS ERROR:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch products" },
      { status: 500 }
    );
  }
}

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
      productCode,
      sku,
      barcode,
      unit,
      imageUrl,
    } = body;

    // Required fields check
    if (!title || !price || !farmerId) {
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
        price: parseFloat(price),
        salePrice: salePrice ? parseFloat(salePrice) : null,
        productStock: productStock ? parseInt(productStock) : 0,
        productCode: productCode || "",
        sku: sku || "",
        barcode: barcode || "",
        unit: unit || "",
        imageUrl: imageUrl || null,
        productImages: productImages || [],
        tags: tags || [],
        isActive: isActive ?? true,
        isWholesale: isWholesale ?? false,
        wholesalePrice: wholesalePrice ? parseFloat(wholesalePrice) : null,
        wholesaleQty: wholesaleQty ? parseInt(wholesaleQty) : null,
        category: categoryId ? { connect: { id: categoryId } } : undefined,
        farmer: { connect: { id: farmerId } },
      },
    });

    return NextResponse.json({ success: true, data: newProduct });
  } catch (error) {
    console.error("CREATE PRODUCT ERROR:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Something went wrong" },
      { status: 500 }
    );
  }
}
