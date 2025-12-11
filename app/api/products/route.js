import { prisma } from "@/lib/prismadb";
import { NextResponse } from "next/server";

// ==============================
// GET — Fetch All Products
// ==============================
export async function GET() {
  try {
    const products = await prisma.product.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        category: true, // category may be null
        farmer: true,   // farmer may be null
      },
    });

    // Ensure category and farmer are always defined (for frontend safety)
    const safeProducts = products.map((p) => ({
      ...p,
      category: p.category ?? null,
      farmer: p.farmer ?? null,
    }));

    return NextResponse.json({
      success: true,
      data: safeProducts,
    });
  } catch (error: any) {
    console.error("PRODUCTS GET ERROR:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch products",
        error: error.message,
        data: [],
      },
      { status: 500 }
    );
  }
}

// ==============================
// POST — Create New Product
// ==============================
export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (!body.title) {
      return NextResponse.json(
        { success: false, message: "Product title is required" },
        { status: 400 }
      );
    }

    // Ensure numeric fields are numbers
    const price = Number(body.price) || 0;
    const salePrice = body.salePrice ? Number(body.salePrice) : 0;
    const wholesalePrice = Number(body.wholesalePrice) || 0;
    const wholesaleQty = Number(body.wholesaleQty) || 0;
    const productStock = Number(body.productStock) || 0;

    // Slug generator
    const slug = body.slug
      ? body.slug.toLowerCase().replace(/\s+/g, "-")
      : body.title.toLowerCase().replace(/\s+/g, "-");

    const newProduct = await prisma.product.create({
      data: {
        title: body.title,
        slug,
        description: body.description || "",
        price,
        salePrice,
        productStock,
        categoryId: body.categoryId || null,
        farmerId: body.farmerId || null,
        imageUrl: body.imageUrl || "",
        productImages: body.productImages || [],
        tags: body.tags || [],
        productCode: body.productCode || "",
        isWholesale: body.isWholesale || false,
        wholesalePrice,
        wholesaleQty,
        isActive: body.isActive ?? true,
      },
      include: {
        category: true,
        farmer: true, // only valid relations
      },
    });

    return NextResponse.json({
      success: true,
      message: "Product created successfully",
      data: newProduct,
    });
  } catch (error: any) {
    console.error("PRODUCT CREATE ERROR:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to create product",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
