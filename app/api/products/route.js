import { prisma } from "@/lib/prismadb";
import { NextResponse } from "next/server";

/* ===============================
   HELPERS
================================ */
function toNumberSafe(val, fallback = 0) {
  const n = Number(val);
  return Number.isFinite(n) ? n : fallback;
}

function removeUndefined(obj) {
  return Object.fromEntries(
    Object.entries(obj).filter(([_, v]) => v !== undefined)
  );
}

/* ===============================
   GET PRODUCTS
   - Admin: all products
   - Farmer: ?farmerId=xxx
   - Search: ?q=tomato
================================ */
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);

    const q = searchParams.get("q") || "";
    const farmerId = searchParams.get("farmerId");
    const limit = parseInt(searchParams.get("limit") || "50");

    const where = {
      ...(q && {
        OR: [
          { title: { contains: q, mode: "insensitive" } },
          { description: { contains: q, mode: "insensitive" } },
        ],
      }),
      ...(farmerId && { farmerId }),
    };

    const products = await prisma.product.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: limit,
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
    console.error("❌ GET PRODUCTS ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch products",
      },
      { status: 500 }
    );
  }
}

/* ===============================
   CREATE PRODUCT
================================ */
export async function POST(req) {
  try {
    const body = await req.json();

    if (!body.title || !body.farmerId) {
      return NextResponse.json(
        { success: false, message: "Title and farmerId are required" },
        { status: 400 }
      );
    }

    // Ensure farmer exists
    const farmer = await prisma.farmer.findUnique({
      where: { id: body.farmerId },
    });

    if (!farmer) {
      return NextResponse.json(
        { success: false, message: "Farmer not found" },
        { status: 404 }
      );
    }

    const productImages = Array.isArray(body.productImages)
      ? body.productImages
      : body.productImages
      ? [body.productImages]
      : [];

    const data = removeUndefined({
      title: body.title,
      slug:
        body.slug ||
        body.title.toLowerCase().replace(/\s+/g, "-"),
      description: body.description || "",
      price: toNumberSafe(body.price),
      salePrice: toNumberSafe(body.salePrice),
      productStock: toNumberSafe(body.productStock),
      imageUrl: productImages[0] || body.imageUrl || null,
      productImages,
      tags: Array.isArray(body.tags) ? body.tags : [],
      productCode: body.productCode || null,
      sku: body.sku || null,
      barcode: body.barcode || null,
      unit: body.unit || null,
      qty: toNumberSafe(body.qty, 1),
      isWholesale: !!body.isWholesale,
      wholesalePrice: toNumberSafe(body.wholesalePrice),
      wholesaleQty: toNumberSafe(body.wholesaleQty),
      isActive: body.isActive ?? true,
      farmer: { connect: { id: body.farmerId } },
      ...(body.categoryId && {
        category: { connect: { id: body.categoryId } },
      }),
    });

    const product = await prisma.product.create({ data });

    return NextResponse.json(
      {
        success: true,
        message: "Product created successfully",
        data: product,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("❌ CREATE PRODUCT ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to create product",
      },
      { status: 500 }
    );
  }
}

/* ===============================
   UPDATE PRODUCT (EDIT)
   - Preserves old images
   - Appends new images
================================ */
export async function PUT(req) {
  try {
    const body = await req.json();

    if (!body.id) {
      return NextResponse.json(
        { success: false, message: "Product ID is required" },
        { status: 400 }
      );
    }

    const existing = await prisma.product.findUnique({
      where: { id: body.id },
    });

    if (!existing) {
      return NextResponse.json(
        { success: false, message: "Product not found" },
        { status: 404 }
      );
    }

    const newImages = Array.isArray(body.productImages)
      ? body.productImages
      : [];

    const mergedImages = [
      ...(existing.productImages || []),
      ...newImages.filter(
        (img) => !existing.productImages.includes(img)
      ),
    ];

    const data = removeUndefined({
      title: body.title,
      description: body.description,
      price: toNumberSafe(body.price),
      salePrice: toNumberSafe(body.salePrice),
      productStock: toNumberSafe(body.productStock),
      productImages: mergedImages,
      imageUrl: mergedImages[0] || existing.imageUrl,
      tags: body.tags,
      isWholesale: body.isWholesale,
      wholesalePrice: toNumberSafe(body.wholesalePrice),
      wholesaleQty: toNumberSafe(body.wholesaleQty),
      isActive: body.isActive,
      ...(body.categoryId && {
        category: { connect: { id: body.categoryId } },
      }),
    });

    const updated = await prisma.product.update({
      where: { id: body.id },
      data,
    });

    return NextResponse.json({
      success: true,
      message: "Product updated successfully",
      data: updated,
    });
  } catch (error) {
    console.error("❌ UPDATE PRODUCT ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to update product",
      },
      { status: 500 }
    );
  }
}
