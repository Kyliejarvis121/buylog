// app/api/products/route.js
import { prisma } from "@/lib/prismadb";
import { NextResponse } from "next/server";

// Helper to safely parse numbers
function toNumberSafe(val, fallback = undefined) {
  if (val === undefined || val === null) return fallback;
  const n = Number(val);
  return Number.isFinite(n) ? n : fallback;
}

// =============================
// CREATE PRODUCT
// =============================
export async function POST(req) {
  try {
    const body = await req.json();

    // Check required fields
    if (!body.title || !body.farmerId) {
      return NextResponse.json(
        { success: false, message: "Title and Farmer are required" },
        { status: 400 }
      );
    }

    // ❗ Verify the farmer actually exists
    const farmer = await prisma.farmer.findUnique({
      where: { id: body.farmerId }
    });

    if (!farmer) {
      return NextResponse.json(
        { success: false, message: "Invalid farmerId — farmer not found" },
        { status: 404 }
      );
    }

    // Build payload
    const payload = {
      title: body.title,
      slug: body.slug,
      description: body.description || null,
      price: toNumberSafe(body.price ?? body.productPrice, 0),
      salePrice: toNumberSafe(body.salePrice, 0),
      productStock: parseInt(body.productStock ?? 0),

      imageUrl: body.imageUrl || (body.productImages?.[0] ?? null),

      productImages: Array.isArray(body.productImages)
        ? body.productImages
        : body.productImages
        ? [body.productImages]
        : [],

      tags: Array.isArray(body.tags) ? body.tags : body.tags ? [body.tags] : [],

      productCode: body.productCode || null,
      sku: body.sku || null,
      barcode: body.barcode || null,
      unit: body.unit || null,

      qty: body.qty ? parseInt(body.qty) : 1,

      isWholesale: !!body.isWholesale,
      wholesalePrice: toNumberSafe(body.wholesalePrice, 0),
      wholesaleQty: body.wholesaleQty ? parseInt(body.wholesaleQty) : 0,

      isActive: body.isActive !== undefined ? !!body.isActive : true,

      // NOW SAFE
      farmerId: body.farmerId,

      categoryId: body.categoryId ?? null,
    };

    const product = await prisma.product.create({ data: payload });

    return NextResponse.json({ success: true, data: product });
  } catch (error) {
    console.error("CREATE PRODUCT ERROR:", error);
    return NextResponse.json(
      { success: false, message: "Failed to create product", error: error.message },
      { status: 500 }
    );
  }
}

// =============================
// GET ALL PRODUCTS
// =============================
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
