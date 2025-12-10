import { NextResponse } from "next/server";
import { prisma } from "@/lib/prismadb";

// =============================
// GET ALL PRODUCTS
// =============================
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
    console.error("GET ALL PRODUCTS ERROR:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch products" },
      { status: 500 }
    );
  }
}

// =============================
// CREATE PRODUCT
// =============================
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
      imageUrl,
    } = body;

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
      { success: false, message: error.message || "Failed to create product" },
      { status: 500 }
    );
  }
}
