import { NextResponse } from "next/server";
import { prisma } from "@/lib/prismadb";

/* =============================
   GET ONE PRODUCT BY ID
============================= */
export async function GET(req, { params }) {
  try {
    const product = await prisma.product.findUnique({
      where: { id: params.id },
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

    return NextResponse.json({ success: true, data: product });
  } catch (error) {
    console.error("GET PRODUCT ERROR:", error);
    return NextResponse.json(
      { success: false, message: "Error fetching product", error: error.message },
      { status: 500 }
    );
  }
}

/* =============================
   UPDATE PRODUCT BY ID
============================= */
export async function PUT(req, { params }) {
  try {
    const body = await req.json();

    // Extract multiple images if provided
    const productImages = Array.isArray(body.productImages)
      ? body.productImages
      : undefined;

    const updated = await prisma.product.update({
      where: { id: params.id },
      data: {
        title: body.title,
        slug: body.slug,
        description: body.description,

        price: body.price !== undefined ? parseFloat(body.price) : undefined,
        salePrice:
          body.salePrice !== undefined ? parseFloat(body.salePrice) : undefined,
        productStock:
          body.productStock !== undefined
            ? parseInt(body.productStock)
            : undefined,

        // Wholesale fields
        isWholesale: body.isWholesale,
        wholesalePrice:
          body.wholesalePrice !== undefined
            ? parseFloat(body.wholesalePrice)
            : undefined,
        wholesaleQty:
          body.wholesaleQty !== undefined
            ? parseInt(body.wholesaleQty)
            : undefined,

        // Multiple Images
        productImages: productImages,
        imageUrl:
          productImages && productImages.length > 0
            ? productImages[0]
            : undefined,

        // Tags
        tags: Array.isArray(body.tags) ? body.tags : undefined,

        // Category relation
        categoryId: body.categoryId ? body.categoryId : undefined,

        // Farmer relation
        farmerId: body.farmerId ? body.farmerId : undefined,

        // Other fields
        productCode: body.productCode,
        unit: body.unit,
        sku: body.sku,
        barcode: body.barcode,
        isActive: body.isActive,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Product updated successfully",
      data: updated,
    });
  } catch (error) {
    console.error("UPDATE PRODUCT ERROR:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update product", error: error.message },
      { status: 500 }
    );
  }
}

/* =============================
   DELETE PRODUCT
============================= */
export async function DELETE(req, { params }) {
  try {
    await prisma.product.delete({
      where: { id: params.id },
    });

    return NextResponse.json({
      success: true,
      message: "Product deleted",
    });
  } catch (error) {
    console.error("DELETE PRODUCT ERROR:", error);
    return NextResponse.json(
      { success: false, message: "Failed to delete product", error: error.message },
      { status: 500 }
    );
  }
}
