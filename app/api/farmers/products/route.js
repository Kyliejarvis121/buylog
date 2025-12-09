import { NextResponse } from "next/server";
import { prisma } from "@/lib/prismadb";

// GET all products for a farmer
export async function GET(req) {
  try {
    const farmerId = req.nextUrl.searchParams.get("farmerId");
    if (!farmerId) {
      return NextResponse.json(
        { success: false, message: "farmerId is required" },
        { status: 400 }
      );
    }

    const products = await prisma.product.findMany({
      where: { farmerId },
      include: { category: true },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, data: products });
  } catch (error) {
    console.error("FETCH PRODUCTS ERROR:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch products", error: error.message },
      { status: 500 }
    );
  }
}

// POST new product
export async function POST(req) {
  try {
    const body = await req.json();
    const {
      title,
      slug,
      description,
      price,
      salePrice,
      productStock,
      categoryId,
      farmerId,
      imageUrl,
      productImages,
      tags,
      isActive,
      isWholesale,
      wholesalePrice,
      wholesaleQty,
      productCode,
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
        description: description || "",
        price: parseFloat(price),
        salePrice: salePrice ? parseFloat(salePrice) : null,
        productStock: productStock ? parseInt(productStock) : 0,
        categoryId: categoryId || null,
        farmerId,
        imageUrl: imageUrl || (productImages?.[0] ?? null),
        productImages: productImages || [],
        tags: tags || [],
        isActive: isActive ?? true,
        isWholesale: isWholesale ?? false,
        wholesalePrice: wholesalePrice ? parseFloat(wholesalePrice) : null,
        wholesaleQty: wholesaleQty ? parseInt(wholesaleQty) : null,
        productCode: productCode || "",
      },
    });

    return NextResponse.json({ success: true, data: newProduct });
  } catch (error) {
    console.error("CREATE PRODUCT ERROR:", error);
    return NextResponse.json(
      { success: false, message: "Failed to create product", error: error.message },
      { status: 500 }
    );
  }
}
