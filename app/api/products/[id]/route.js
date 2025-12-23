import { prisma } from "@/lib/prismadb";
import { NextResponse } from "next/server";

/**
 * Safe number parser
 */
function toNumber(val, fallback = 0) {
  if (val === undefined || val === null || val === "") return fallback;
  const num = Number(val);
  return Number.isFinite(num) ? num : fallback;
}

/* =====================================================
   GET PRODUCT BY ID
===================================================== */
export async function GET(req, { params }) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Product ID is required" },
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

    return NextResponse.json({
      success: true,
      data: product,
    });
  } catch (error) {
    console.error("❌ PRODUCT GET ERROR:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch product" },
      { status: 500 }
    );
  }
}

/* =====================================================
   UPDATE PRODUCT
===================================================== */
export async function PUT(req, { params }) {
  try {
    const { id } = params;
    const body = await req.json();

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Product ID is required" },
        { status: 400 }
      );
    }

    /** Build update object safely */
    const data = {};

    if ("title" in body) data.title = body.title;
    if ("slug" in body) data.slug = body.slug;
    if ("description" in body) data.description = body.description;

    if ("price" in body) data.price = toNumber(body.price);
    if ("salePrice" in body) data.salePrice = toNumber(body.salePrice);
    if ("productStock" in body)
      data.productStock = parseInt(body.productStock || 0);

    if ("imageUrl" in body) data.imageUrl = body.imageUrl || null;

    if ("productImages" in body)
      data.productImages = Array.isArray(body.productImages)
        ? body.productImages
        : [];

    if ("tags" in body)
      data.tags = Array.isArray(body.tags) ? body.tags : [];

    if ("sku" in body) data.sku = body.sku;
    if ("barcode" in body) data.barcode = body.barcode;
    if ("unit" in body) data.unit = body.unit;
    if ("qty" in body) data.qty = parseInt(body.qty || 1);

    if ("isWholesale" in body) data.isWholesale = Boolean(body.isWholesale);
    if ("wholesalePrice" in body)
      data.wholesalePrice = toNumber(body.wholesalePrice);
    if ("wholesaleQty" in body)
      data.wholesaleQty = parseInt(body.wholesaleQty || 0);

    if ("productCode" in body) data.productCode = body.productCode;
    if ("isActive" in body) data.isActive = Boolean(body.isActive);

    /** Category relation */
    if ("categoryId" in body) {
      data.category = body.categoryId
        ? { connect: { id: body.categoryId } }
        : { disconnect: true };
    }

    /** Farmer relation */
    if ("farmerId" in body) {
      data.farmer = body.farmerId
        ? { connect: { id: body.farmerId } }
        : { disconnect: true };
    }

    const updatedProduct = await prisma.product.update({
      where: { id },
      data,
      include: {
        category: true,
        farmer: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Product updated successfully",
      data: updatedProduct,
    });
  } catch (error) {
    console.error("❌ PRODUCT UPDATE ERROR:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update product" },
      { status: 500 }
    );
  }
}

/* =====================================================
   DELETE PRODUCT
===================================================== */
export async function DELETE(req, { params }) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Product ID is required" },
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
    console.error("❌ PRODUCT DELETE ERROR:", error);
    return NextResponse.json(
      { success: false, message: "Failed to delete product" },
      { status: 500 }
    );
  }
}
