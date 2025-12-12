import { prisma } from "@/lib/prismadb";
import { NextResponse } from "next/server";

/**
 * Helper: safely parse numbers - returns fallback when invalid
 */
function toNumberSafe(val, fallback = undefined) {
  if (val === undefined || val === null) return fallback;
  const n = Number(val);
  return Number.isFinite(n) ? n : fallback;
}

/**
 * Build a clean object by removing undefined keys
 */
function removeUndef(obj) {
  const out = {};
  for (const k in obj) if (obj[k] !== undefined) out[k] = obj[k];
  return out;
}

/**
 * GET /api/products
 * - q: text search (title, description)
 * - catId: category id to filter
 * - farmerId: farmer id to filter
 * - page, limit: pagination
 */
export async function GET(req) {
  try {
    const url = new URL(req.url);
    const q = url.searchParams.get("q") || "";
    const catId = url.searchParams.get("catId") || undefined;
    const farmerId = url.searchParams.get("farmerId") || undefined;
    const page = Math.max(1, parseInt(url.searchParams.get("page") || "1"));
    const limit = Math.max(1, Math.min(100, parseInt(url.searchParams.get("limit") || "50")));
    const skip = (page - 1) * limit;

    const where = {
      AND: [
        q
          ? {
              OR: [
                { title: { contains: q, mode: "insensitive" } },
                { description: { contains: q, mode: "insensitive" } },
              ],
            }
          : undefined,
        catId ? { categoryId: catId } : undefined,
        farmerId ? { farmerId } : undefined,
      ].filter(Boolean),
    };

    const products = await prisma.product.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
      include: { category: true, farmer: true },
    });

    const total = await prisma.product.count({ where });

    return NextResponse.json({
      success: true,
      data: products,
      meta: { total, page, limit },
    });
  } catch (error) {
    console.error("GET PRODUCTS ERROR:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch products", error: error.message, data: [] },
      { status: 500 }
    );
  }
}

/**
 * POST /api/products
 * Accepts both farmer & admin payloads. Must include title and farmerId.
 * Fields accepted (not exhaustive): title, slug, description,
 * productPrice/price, salePrice, productStock, categoryId, farmerId,
 * productImages (array), imageUrl, tags (array), productCode, sku, barcode, unit,
 * qty, isWholesale, wholesalePrice, wholesaleQty, isActive
 */
export async function POST(req) {
  try {
    const body = await req.json();

    // Basic required fields
    if (!body.title) {
      return NextResponse.json({ success: false, message: "Product title is required" }, { status: 400 });
    }
    // Prefer farmerId presence for farmer-created items; admin can include farmerId for linking
    if (!body.farmerId) {
      return NextResponse.json({ success: false, message: "farmerId is required to link product to a farmer" }, { status: 400 });
    }

    // Confirm farmer exists to avoid P2025
    const farmer = await prisma.farmer.findUnique({ where: { id: body.farmerId } });
    if (!farmer) {
      return NextResponse.json({ success: false, message: "Farmer not found for provided farmerId" }, { status: 404 });
    }

    // If categoryId provided, ensure it exists
    let categoryConnect = undefined;
    if (body.categoryId) {
      const cat = await prisma.category.findUnique({ where: { id: body.categoryId } });
      if (!cat) {
        return NextResponse.json({ success: false, message: "Category not found for provided categoryId" }, { status: 404 });
      }
      categoryConnect = { connect: { id: body.categoryId } };
    }

    // Map numeric fields carefully
    const price = toNumberSafe(body.price ?? body.productPrice, 0);
    const salePrice = body.salePrice !== undefined ? toNumberSafe(body.salePrice, null) : null;
    const productStock = Number.isFinite(Number(body.productStock)) ? parseInt(body.productStock) : 0;
    const wholesalePrice = body.wholesalePrice !== undefined ? toNumberSafe(body.wholesalePrice, 0) : 0;
    const wholesaleQty = body.wholesaleQty !== undefined ? parseInt(body.wholesaleQty || 0) : 0;
    const qty = body.qty !== undefined ? parseInt(body.qty || 1) : 1;

    // Images & arrays
    const productImages = Array.isArray(body.productImages)
      ? body.productImages
      : body.productImages
      ? [body.productImages]
      : [];

    const tags = Array.isArray(body.tags) ? body.tags : body.tags ? [body.tags] : [];

    // Build data for prisma.create (only defined fields)
    const createData = removeUndef({
      title: body.title,
      slug: body.slug || (body.title ? String(body.title).toLowerCase().replace(/\s+/g, "-") : undefined),
      description: body.description ?? "",
      price,
      salePrice,
      productStock,
      imageUrl: body.imageUrl ?? (productImages[0] ?? null),
      productImages,
      tags,
      productCode: body.productCode ?? null,
      sku: body.sku ?? null,
      barcode: body.barcode ?? null,
      unit: body.unit ?? null,
      qty,
      isWholesale: body.isWholesale !== undefined ? !!body.isWholesale : undefined,
      wholesalePrice,
      wholesaleQty,
      isActive: body.isActive !== undefined ? !!body.isActive : true,
      // relations use nested connect
      farmer: { connect: { id: body.farmerId } },
      category: categoryConnect,
    });

    // Remove category if undefined (removeUndef left it in when undefined)
    if (createData.category === undefined) delete createData.category;

    const newProduct = await prisma.product.create({ data: createData });

    return NextResponse.json({ success: true, message: "Product created", data: newProduct }, { status: 201 });
  } catch (error) {
    console.error("CREATE PRODUCT ERROR:", error);

    // If this error is Prisma known request error with code P2025, capture readable message
    const msg = error?.meta?.cause || error?.message || "Failed to create product";
    return NextResponse.json({ success: false, message: "Failed to create product", error: msg }, { status: 500 });
  }
}
