import { prisma } from "@/lib/prismadb";
import { NextResponse } from "next/server";

// GET all products for a farmer
export async function GET(req) {
  try {
    const url = new URL(req.url);
    const farmerId = url.searchParams.get("farmerId");

    if (!farmerId) {
      return NextResponse.json(
        { success: false, message: "farmerId is required" },
        { status: 400 }
      );
    }

    const products = await prisma.product.findMany({
      where: { farmerId },
      orderBy: { createdAt: "desc" },
      include: { category: true },
    });

    return NextResponse.json({ success: true, data: products });
  } catch (error) {
    console.error("❌ GET FARMER PRODUCTS ERROR:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch products", error: error.message },
      { status: 500 }
    );
  }
}

// CREATE product for a farmer
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
        slug: body.slug || body.title.toLowerCase().replace(/\s+/g, "-"),
        description: body.description || "",
        price: Number(body.price) || 0,
        salePrice: Number(body.salePrice) || 0,
        productStock: Number(body.productStock) || 0,
        qty: Number(body.qty) || 1,
        imageUrl: Array.isArray(body.productImages) ? body.productImages[0] : body.imageUrl,
        productImages: body.productImages || [],
        tags: body.tags || [],
        productCode: body.productCode || "",
        sku: body.sku || "",
        barcode: body.barcode || "",
        unit: body.unit || "",
        isWholesale: !!body.isWholesale,
        wholesalePrice: Number(body.wholesalePrice) || 0,
        wholesaleQty: Number(body.wholesaleQty) || 0,
        isActive: body.isActive ?? true,

        // ✅ New field for seller contact
        phoneNumber: body.phoneNumber || "",

        farmer: { connect: { id: body.farmerId } },

        category: body.categoryId
          ? { connect: { id: body.categoryId } }
          : undefined,
      },
    });

    return NextResponse.json({ success: true, data: product }, { status: 201 });
  } catch (error) {
    console.error("❌ CREATE PRODUCT ERROR:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to create product" },
      { status: 500 }
    );
  }
}
