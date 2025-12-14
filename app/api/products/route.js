import { prisma } from "@/lib/prismadb";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      orderBy: { createdAt: "desc" },
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
    console.error("❌ PRODUCTS GET ERROR:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch products" },
      { status: 500 }
    );
  }
}

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
        title: body.title,
        slug: body.slug,
        description: body.description || "",
        price: Number(body.price) || 0,
        salePrice: Number(body.salePrice) || 0,
        productStock: Number(body.productStock) || 0,
        imageUrl: body.imageUrl,
        productImages: body.productImages || [],
        tags: body.tags || [],
        productCode: body.productCode || null,
        isWholesale: !!body.isWholesale,
        wholesalePrice: Number(body.wholesalePrice) || 0,
        wholesaleQty: Number(body.wholesaleQty) || 0,
        isActive: body.isActive ?? true,
        qty: body.qty || 1,

        farmer: {
          connect: { id: body.farmerId },
        },

        category: body.categoryId
          ? { connect: { id: body.categoryId } }
          : undefined,
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
