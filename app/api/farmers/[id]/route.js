// app/api/products/[id]/route.js
import { prisma } from "@/lib/prismadb";
import { NextResponse } from "next/server";

function toNumberSafe(val, fallback = undefined) {
  if (val === undefined || val === null) return fallback;
  const n = Number(val);
  return Number.isFinite(n) ? n : fallback;
}

// ======================================================
// GET PRODUCT BY ID
// ======================================================
export async function GET(req, { params }) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Product id required" },
        { status: 400 }
      );
    }

    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        farmer: true,
      },
    });

    if (!product) {
      return NextResponse.json(
        { success: false, message: "Product not found" },
        { status: 404 }
      );
    }

    const imageUrl =
      product.imageUrl ?? (product.productImages?.[0] ?? null);

    return NextResponse.json({
      success: true,
      data: {
        ...product,
        productPrice: product.price,
        imageUrl,
      },
    });
  } catch (error) {
    console.error("PRODUCT [id] GET ERROR:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch product",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

// ======================================================
// UPDATE PRODUCT
// ======================================================
export async function PUT(req, { params }) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Product id required" },
        { status: 400 }
      );
    }

    const body = await req.json();

    const updates = {};

    // ========== BASIC FIELDS ==========
    if (body.title !== undefined) updates.title = body.title;
    if (body.slug !== undefined) updates.slug = body.slug;
    if (body.description !== undefined) updates.description = body.description;

    // ========== PRICE ==========
    if (body.productPrice !== undefined)
      updates.price = toNumberSafe(body.productPrice);
    if (body.price !== undefined)
      updates.price = toNumberSafe(body.price);
    if (body.salePrice !== undefined)
      updates.salePrice = toNumberSafe(body.salePrice);

    // ========== STOCK ==========
    if (body.productStock !== undefined)
      updates.productStock = parseInt(body.productStock ?? 0);

    // ========== CATEGORY CONNECT ==========
    if (body.categoryId !== undefined) {
      updates.category = body.categoryId
        ? { connect: { id: body.categoryId } }
        : { disconnect: true };
    }

    // ========== FARMER CONNECT ==========
    if (body.farmerId !== undefined) {
      updates.farmer = body.farmerId
        ? { connect: { id: body.farmerId } }
        : { disconnect: true };
    }

    // ========== IMAGES ==========
    if (body.imageUrl !== undefined)
      updates.imageUrl = body.imageUrl || null;

    if (body.productImages !== undefined) {
      updates.productImages = Array.isArray(body.productImages)
        ? body.productImages
        : [body.productImages];
    }

    // ========== TAGS ==========
    if (body.tags !== undefined)
      updates.tags = Array.isArray(body.tags) ? body.tags : [body.tags];

    // ========== SKU, BARCODE, UNIT ==========
    if (body.sku !== undefined) updates.sku = body.sku;
    if (body.barcode !== undefined) updates.barcode = body.barcode;
    if (body.unit !== undefined) updates.unit = body.unit;

    // ========== QUANTITY FIELD ==========
    if (body.qty !== undefined)
      updates.qty = parseInt(body.qty ?? 0);

    // ========== WHOLESALE ==========
    if (body.isWholesale !== undefined)
      updates.isWholesale = !!body.isWholesale;

    if (body.wholesalePrice !== undefined)
      updates.wholesalePrice = toNumberSafe(body.wholesalePrice);

    if (body.wholesaleQty !== undefined)
      updates.wholesaleQty = parseInt(body.wholesaleQty ?? 0);

    // ========== PRODUCT CODE ==========
    if (body.productCode !== undefined)
      updates.productCode = body.productCode;

    // ========== ACTIVE STATUS ==========
    if (body.isActive !== undefined)
      updates.isActive = !!body.isActive;

    const updatedProduct = await prisma.product.update({
      where: { id },
      data: updates,
      include: { category: true, farmer: true },
    });

    return NextResponse.json({
      success: true,
      data: updatedProduct,
    });
  } catch (error) {
    console.error("PRODUCT [id] PUT ERROR:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to update product",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

// ======================================================
// DELETE PRODUCT
// ======================================================
export async function DELETE(req, { params }) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Product id required" },
        { status: 400 }
      );
    }

    await prisma.product.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.error("PRODUCT [id] DELETE ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to delete product",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
