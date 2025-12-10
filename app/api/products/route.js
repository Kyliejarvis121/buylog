// app/api/products/route.js
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

    // Map any null price to 0 to avoid crashes
    const safeProducts = products.map(p => ({
      ...p,
      price: p.price ?? 0,
      salePrice: p.salePrice ?? 0,
      productStock: p.productStock ?? 0,
      tags: p.tags ?? [],
      productImages: p.productImages ?? [],
    }));

    return NextResponse.json({ success: true, data: safeProducts });
  } catch (error) {
    console.error("GET PRODUCTS ERROR:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch products", error: error.message },
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
        salePrice: salePrice ? parseFloat(salePrice) : 0,
        categoryId: categoryId || null,
        farmerId,
        productImages: productImages || [],
        tags: tags || [],
        isActive: isActive ?? true,
        isWholesale: isWholesale ?? false,
        wholesalePrice: wholesalePrice ? parseFloat(wholesalePrice) : null,
        wholesaleQty: wholesaleQty ? parseInt(wholesaleQty) : null,
        productStock: productStock ?? 0,
        productCode: productCode || "",
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
