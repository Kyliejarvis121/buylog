import { prisma } from "@/lib/prismadb";
import { NextResponse } from "next/server";

function toNumberSafe(val, fallback = undefined) {
  if (val === undefined || val === null) return fallback;
  const n = Number(val);
  return Number.isFinite(n) ? n : fallback;
}

function removeUndef(obj) {
  const out = {};
  for (const k in obj) if (obj[k] !== undefined) out[k] = obj[k];
  return out;
}

// =============================
// GET PRODUCTS
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

// =============================
// CREATE PRODUCT
// =============================
export async function POST(req) {
  try {
    const body = await req.json();

    if (!body.title) {
      return NextResponse.json({ success: false, message: "Product title is required" }, { status: 400 });
    }

    if (!body.farmerId) {
      return NextResponse.json({ success: false, message: "farmerId is required to link product" }, { status: 400 });
    }

    // verify farmer exists
    const farmer = await prisma.farmer.findUnique({ where: { id: body.farmerId } });
    if (!farmer) {
      return NextResponse.json({ success: false, message: "Farmer not found" }, { status: 404 });
    }

    let categoryConnect = undefined;
    if (body.categoryId) {
      const category = await prisma.category.findUnique({ where: { id: body.categoryId } });
      if (!category) {
        return NextResponse.json({ success: false, message: "Category not found" }, { status: 404 });
      }
      categoryConnect = { connect: { id: body.categoryId } };
    }

    const price = toNumberSafe(body.price ?? body.productPrice, 0);
    const salePrice = body.salePrice !== undefined ? toNumberSafe(body.salePrice, null) : null;
    const productStock = Number.isFinite(Number(body.productStock)) ? parseInt(body.productStock) : 0;
    const wholesalePrice = body.wholesalePrice !== undefined ? toNumberSafe(body.wholesalePrice, 0) : 0;
    const wholesaleQty = body.wholesaleQty !== undefined ? parseInt(body.wholesaleQty || 0) : 0;
    const qty = body.qty !== undefined ? parseInt(body.qty || 1) : 1;

    const productImages = Array.isArray(body.productImages) ? body.productImages : body.productImages ? [body.productImages] : [];
    const tags = Array.isArray(body.tags) ? body.tags : body.tags ? [body.tags] : [];

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
      farmer: { connect: { id: body.farmerId } },
      category: categoryConnect,
    });

    if (createData.category === undefined) delete createData.category;

    const product = await prisma.product.create({ data: createData });

    return NextResponse.json({ success: true, message: "Product created", data: product }, { status: 201 });
  } catch (error) {
    console.error("CREATE PRODUCT ERROR:", error);
    const msg = error?.meta?.cause || error?.message || "Failed to create product";
    return NextResponse.json({ success: false, message: "Failed to create product", error: msg }, { status: 500 });
  }
}

