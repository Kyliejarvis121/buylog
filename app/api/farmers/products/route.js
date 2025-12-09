import { prisma } from "@/lib/prismadb";
import { NextResponse } from "next/server";

// CREATE NEW PRODUCT
export async function POST(req) {
  try {
    const body = await req.json();

    const {
      title,
      slug,
      description,
      price,
      salePrice,
      categoryId,
      farmerId,
      productImages,
      tags,
      isActive,
      isWholesale,
      wholesalePrice,
      wholesaleQty,
      productStock,
      qty,
      productCode,
      sku,
      barcode,
      unit,
      imageUrl,
    } = body;

    // Validate required fields
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
        qty: qty ? parseInt(qty) : 0,
        productCode: productCode || "",
        sku: sku || "",
        barcode: barcode || "",
        unit: unit || "",
        imageUrl: imageUrl || null,
        productImages: productImages || [],
        tags: tags || [],
        isActive: isActive ?? true,
        isWholesale: isWholesale ?? false,
        wholesalePrice: wholesalePrice ? parseFloat(wholesalePrice) : null,
        wholesaleQty: wholesaleQty ? parseInt(wholesaleQty) : null,

        // **Connect relations properly**
        category: categoryId ? { connect: { id: categoryId } } : undefined,
        farmer: { connect: { id: farmerId } },
      },
    });

    return NextResponse.json({ success: true, data: newProduct });
  } catch (error) {
    console.error("CREATE PRODUCT ERROR:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Something went wrong" },
      { status: 500 }
    );
  }
}
