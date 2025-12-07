import { prisma } from "@/lib/prismadb";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "FARMER") {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 403 });
    }

    const body = await req.json();

    if (!body.title || !body.slug || !body.price) {
      return NextResponse.json({ success: false, message: "Missing required fields" }, { status: 400 });
    }

    const existing = await prisma.product.findUnique({ where: { slug: body.slug } });
    if (existing) return NextResponse.json({ success: false, message: "Slug already exists" }, { status: 409 });

    const product = await prisma.product.create({
      data: {
        title: body.title,
        slug: body.slug,
        price: Number(body.price),
        salePrice: body.salePrice ? Number(body.salePrice) : null,
        description: body.description || "",
        categoryId: body.categoryId || null,
        farmerId: session.user.id,
        imageUrl: body.productImages?.[0] || "",
        productImages: body.productImages || [],
        tags: body.tags || [],
        isActive: body.isActive ?? true,
        isWholesale: body.isWholesale ?? false,
        wholesalePrice: body.wholesalePrice ? Number(body.wholesalePrice) : null,
        wholesaleQty: body.wholesaleQty ? Number(body.wholesaleQty) : null,
        productStock: body.productStock ? Number(body.productStock) : 0,
        qty: body.qty ? Number(body.qty) : 0,
        productCode: body.productCode || null,
      },
    });

    return NextResponse.json({ success: true, data: product }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, message: "Failed to create product", error: error.message }, { status: 500 });
  }
}
