export const dynamic = "force-dynamic";
export const revalidate = 0;

import { prisma } from "@/lib/prismadb";
import { NextResponse } from "next/server";

/* ===============================
   GET PRODUCTS
   - Admin: /api/products?all=true
   - Frontend: /api/products
================================ */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);

    const page = Number(searchParams.get("page") || 1);
    const limit = Number(searchParams.get("limit") || 20);
    const skip = (page - 1) * limit;
    const search = searchParams.get("q")?.trim() || "";
    const showAll = searchParams.get("all") === "true";

    const where = {
      ...(search && {
        title: { contains: search, mode: "insensitive" },
      }),
      ...(showAll ? {} : { isActive: true }), // ✅ KEY FIX
    };

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
        include: {
          category: true,
          farmer: true,
        },
      }),
      prisma.product.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: products,
      total,
      page,
      limit,
    });
  } catch (error) {
    console.error("❌ PRODUCTS GET ERROR:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch products" },
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

    const product = await prisma.product.create({
      data: {
        title: body.title.trim(),
        slug: body.slug,
        description: body.description || "",
        price: Number(body.price) || 0,
        salePrice: Number(body.salePrice) || 0,
        productStock: Number(body.productStock) || 0,
        imageUrl: body.imageUrl,
        productImages: body.productImages || [],
        tags: body.tags || [],
        productCode: body.productCode || null,

        isWholesale: Boolean(body.isWholesale),
        wholesalePrice: Number(body.wholesalePrice) || 0,
        wholesaleQty: Number(body.wholesaleQty) || 0,

        isActive: body.isActive ?? true, // ✅ DEFAULT TRUE
        qty: Number(body.qty) || 1,

        farmer: {
          connect: { id: body.farmerId },
        },

        ...(body.categoryId && {
          category: { connect: { id: body.categoryId } },
        }),
      },
    });

    return NextResponse.json(
      { success: true, message: "Product created", data: product },
      { status: 201 }
    );
  } catch (error) {
    console.error("❌ PRODUCT CREATE ERROR:", error);
    return NextResponse.json(
      { success: false, message: "Failed to create product" },
      { status: 500 }
    );
  }
}

/* ===============================
   DELETE PRODUCT (ADMIN)
================================ */
export async function DELETE(request) {
  try {
    const { id } = await request.json();

    if (!id) {
      return NextResponse.json(
        { message: "Product ID is required" },
        { status: 400 }
      );
    }

    await prisma.product.delete({
      where: { id },
    });

    return NextResponse.json({
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.error("❌ PRODUCT DELETE ERROR:", error);
    return NextResponse.json(
      { message: "Failed to delete product" },
      { status: 500 }
    );
  }
}
