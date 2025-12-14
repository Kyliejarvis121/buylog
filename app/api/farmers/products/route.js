import { prisma } from "@/lib/prismadb";
import { NextResponse } from "next/server";

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
    } = body;

    // Validate required fields
    if (!title || !price || !farmerId) {
      return NextResponse.json(
        { success: false, message: "Missing required fields: title, price, or farmerId" },
        { status: 400 }
      );
    }

    // Check if farmer exists
    const farmer = await prisma.farmer.findUnique({ where: { id: farmerId } });
    if (!farmer) {
      return NextResponse.json(
        { success: false, message: "Farmer not found" },
        { status: 404 }
      );
    }

    // Optional: Check if category exists
    let categoryConnect = undefined;
    if (categoryId) {
      const category = await prisma.category.findUnique({ where: { id: categoryId } });
      if (category) categoryConnect = { connect: { id: categoryId } };
    }

    // Ensure productImages is an array
    const imagesArray = Array.isArray(productImages)
      ? productImages
      : productImages
      ? [productImages]
      : [];

    // Create product
    const newProduct = await prisma.product.create({
      data: {
        title,
        slug: slug || title.toLowerCase().replace(/\s+/g, "-"),
        description: description || "",
        price: parseFloat(price),
        salePrice: salePrice ? parseFloat(salePrice) : null,
        productStock: productStock ? parseInt(productStock) : 0,
        qty: qty ? parseInt(qty) : 1,
        productCode: productCode || "",
        sku: sku || "",
        barcode: barcode || "",
        unit: unit || "",
        imageUrl: imagesArray[0] || null, // main image
        productImages: imagesArray,
        tags: tags || [],
        isActive: isActive ?? true,
        isWholesale: isWholesale ?? false,
        wholesalePrice: wholesalePrice ? parseFloat(wholesalePrice) : 0,
        wholesaleQty: wholesaleQty ? parseInt(wholesaleQty) : 0,
        farmer: { connect: { id: farmerId } },
        category: categoryConnect,
      },
    });

    return NextResponse.json({ success: true, data: newProduct }, { status: 201 });
  } catch (error) {
    console.error("CREATE PRODUCT ERROR:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to create product" },
      { status: 500 }
    );
  }
}
