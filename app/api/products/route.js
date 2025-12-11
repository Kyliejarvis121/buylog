// app/api/products/route.js
import { prisma } from "@/lib/prismadb";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

function toNumberSafe(val, fallback = 0) {
  const n = Number(val);
  return Number.isFinite(n) ? n : fallback;
}

export async function GET(req) {
  try {
    // Optional query params: q, page, limit, catId, farmerId
    const url = new URL(req.url);
    const q = url.searchParams.get("q") || "";
    const page = Math.max(1, parseInt(url.searchParams.get("page") || "1"));
    const limit = Math.max(1, parseInt(url.searchParams.get("limit") || "50"));
    const skip = (page - 1) * limit;
    const catId = url.searchParams.get("catId") || null;
    const farmerId = url.searchParams.get("farmerId") || null;

    const where = {};

    if (q) {
      // Basic text filter on title (simple)
      where.title = { contains: q, mode: "insensitive" };
    }
    if (catId) {
      where.categoryId = catId;
    }
    if (farmerId) {
      where.farmerId = farmerId;
    }

    const products = await prisma.product.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
      include: {
        category: true,
        farmer: true,
      },
    });

    // Normalize shape & fallback imageUrl
    const normalized = products.map((p) => ({
      ...p,
      // Some older code used `price` and some used `productPrice` — keep both when returning
      price: p.price ?? (p.productPrice ?? 0),
      productPrice: p.productPrice ?? p.price ?? 0,
      imageUrl: p.imageUrl || (Array.isArray(p.productImages) && p.productImages.length ? p.productImages[0] : null),
    }));

    return NextResponse.json({ success: true, data: normalized });
  } catch (error) {
    console.error("PRODUCTS GET ERROR:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch products", error: error.message, data: [] },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    const body = await req.json();

    // accept either productPrice or price (backwards-compat)
    const rawPrice = body.productPrice ?? body.price ?? body.productPrice === 0 ? body.productPrice : body.price;
    const price = toNumberSafe(rawPrice, 0);

    const salePrice = body.salePrice ?? body.salePrice === 0 ? toNumberSafe(body.salePrice, 0) : null;
    const wholesalePrice = toNumberSafe(body.wholesalePrice, 0);
    const wholesaleQty = Number.isInteger(Number(body.wholesaleQty)) ? parseInt(body.wholesaleQty) : 0;
    const productStock = Number.isInteger(Number(body.productStock)) ? parseInt(body.productStock) : 0;
    const qty = Number.isInteger(Number(body.qty)) ? parseInt(body.qty) : 0;

    if (!body.title) {
      return NextResponse.json({ success: false, message: "Product title is required" }, { status: 400 });
    }

    // Build slug if not provided
    const slug = body.slug
      ? String(body.slug).toLowerCase().replace(/\s+/g, "-")
      : String(body.title).toLowerCase().replace(/\s+/g, "-");

    // Ensure arrays exist
    const productImages = Array.isArray(body.productImages) ? body.productImages : (body.productImages ? [body.productImages] : []);
    const tags = Array.isArray(body.tags) ? body.tags : (body.tags ? [body.tags] : []);

    const data = {
      title: body.title,
      slug,
      description: body.description ?? "",
      // Prisma schema expects `price` field — set it
      price,
      salePrice: salePrice !== null ? salePrice : undefined,
      productStock,
      categoryId: body.categoryId || null,
      farmerId: body.farmerId || null,
      imageUrl: body.imageUrl || (productImages.length ? productImages[0] : null),
      productImages,
      tags,
      productCode: body.productCode ?? "",
      sku: body.sku ?? "",
      barcode: body.barcode ?? "",
      unit: body.unit ?? "",
      isWholesale: !!body.isWholesale,
      wholesalePrice,
      wholesaleQty,
      qty,
      isActive: typeof body.isActive === "boolean" ? body.isActive : true,
    };

    // Create product
    const newProduct = await prisma.product.create({ data });

    // Add compatibility fields to response
    const responseProduct = {
      ...newProduct,
      productPrice: newProduct.price,
      imageUrl: newProduct.imageUrl || (newProduct.productImages?.[0] ?? null),
    };

    return NextResponse.json({ success: true, data: responseProduct }, { status: 201 });
  } catch (error) {
    console.error("PRODUCTS POST ERROR:", error);
    return NextResponse.json(
      { success: false, message: "Failed to create product", error: error.message },
      { status: 500 }
    );
  }
}
