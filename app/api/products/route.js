import { NextResponse } from "next/server";
import { prisma } from "@/lib/prismadb";
import slugify from "slugify";

// ==========================
// GET all products (optionally filter by category)
// ==========================
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const catId = searchParams.get("catId");

    const products = await prisma.product.findMany({
      where: catId ? { categoryId: catId } : {},
      orderBy: { createdAt: "desc" },
      include: {
        category: true,
        farmer: true,
      }
    });

    // Map response to match frontend formats
    const mapped = products.map((p) => ({
      id: p.id,
      title: p.title,
      slug: p.slug,
      description: p.description,
      price: p.price,
      salePrice: p.salePrice,
      productStock: p.productStock,
      sku: p.sku,
      isActive: p.isActive,
      categoryId: p.categoryId,
      farmerId: p.farmerId,
      imageUrl: p.imageUrl,
      productImages: p.productImages || [],
      createdAt: p.createdAt,
      updatedAt: p.updatedAt,

      // Attach category info
      category: p.category
        ? {
            id: p.category.id,
            title: p.category.title,
            slug: p.category.slug,
          }
        : null,

      // Attach farmer info
      farmer: p.farmer
        ? {
            id: p.farmer.id,
            name: p.farmer.name,
            phone: p.farmer.phone,
            status: p.farmer.status,
          }
        : null,
    }));

    return NextResponse.json({ success: true, data: mapped });
  } catch (error) {
    console.error("FETCH PRODUCTS ERROR:", error);
    return NextResponse.json(
      { success: false, message: "Error fetching products" },
      { status: 500 }
    );
  }
}

// ==========================
// CREATE product
// ==========================
export async function POST(req) {
  try {
    const data = await req.json();
    const {
      title,
      description,
      salePrice,
      price,
      productStock,
      categoryId,
      farmerId,
      imageUrl,
      productImages,
      sku,
      isActive,
    } = data;

    // Validation
    if (!title || !salePrice || !farmerId || !categoryId) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    if (!productImages || productImages.length === 0) {
      return NextResponse.json(
        { success: false, message: "Upload at least one product image" },
        { status: 400 }
      );
    }

    // Generate unique slug
    const baseSlug = slugify(title, { lower: true, strict: true });
    let uniqueSlug = baseSlug;
    let count = 1;

    while (await prisma.product.findUnique({ where: { slug: uniqueSlug } })) {
      uniqueSlug = `${baseSlug}-${count++}`;
    }

    // Create product
    const product = await prisma.product.create({
      data: {
        title,
        description,
        price: Number(price || salePrice),
        salePrice: Number(salePrice),
        productStock: Number(productStock || 0),
        categoryId,
        farmerId,
        imageUrl,
        productImages,
        sku,
        isActive: Boolean(isActive),
        slug: uniqueSlug,
      },
      include: {
        category: true,
        farmer: true,
      },
    });

    return NextResponse.json({
      success: true,
      data: product,
      message: "Product created successfully",
    });
  } catch (error) {
    console.error("PRODUCT CREATE ERROR:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Server error creating product",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
