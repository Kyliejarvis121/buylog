import { NextResponse } from "next/server";
import { prisma } from "@/lib/prismadb";
import slugify from "slugify";

// CREATE PRODUCT
export async function POST(req) {
  try {
    const data = await req.json();
    const { title, description, salePrice, productStock, isActive, farmerId, productImages } = data;

    // VALIDATION
    if (!title || !description || !salePrice || !productStock || !farmerId) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    if (!productImages || productImages.length === 0) {
      return NextResponse.json(
        { success: false, message: "Please upload at least one product image" },
        { status: 400 }
      );
    }

    // AUTO-GENERATE SLUG
    const baseSlug = slugify(title, { lower: true, strict: true });
    let uniqueSlug = baseSlug;
    let count = 1;

    // Ensure slug is unique
    while (await prisma.product.findUnique({ where: { slug: uniqueSlug } })) {
      uniqueSlug = `${baseSlug}-${count++}`;
    }

    // CREATE PRODUCT
    const product = await prisma.product.create({
      data: {
        title,
        description,
        salePrice: Number(salePrice),
        productStock: Number(productStock),
        isActive: Boolean(isActive),
        images: productImages,
        farmerId,
        slug: uniqueSlug
      }
    });

    return NextResponse.json({
      success: true,
      message: "Product uploaded successfully",
      data: product
    });

  } catch (error) {
    console.error("PRODUCT CREATE ERROR:", error);
    return NextResponse.json(
      { success: false, message: "Server error uploading product" },
      { status: 500 }
    );
  }
}


// GET ALL PRODUCTS (for dashboard)
export async function GET() {
  try {
    const products = await prisma.product.findMany({
      orderBy: { createdAt: "desc" },
      include: { farmer: true },
    });

    return NextResponse.json({
      success: true,
      data: products,
    });
  } catch (error) {
    console.error("FETCH ERROR:", error);
    return NextResponse.json(
      { success: false, message: "Error fetching products" },
      { status: 500 }
    );
  }
}
