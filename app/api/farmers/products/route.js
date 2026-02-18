import { prisma } from "@/lib/prismadb";
import { NextResponse } from "next/server";

// GET all products for a farmer (optional category & market filter)
export async function GET(req) {
  try {
    const url = new URL(req.url);
    const farmerId = url.searchParams.get("farmerId");
    const categoryId = url.searchParams.get("categoryId"); // optional
    const marketId = url.searchParams.get("marketId");     // optional

    if (!farmerId) {
      return NextResponse.json(
        { success: false, message: "farmerId is required" },
        { status: 400 }
      );
    }

    // Build where clause
    const whereClause = { farmerId };

    if (categoryId) whereClause.categoryId = Number(categoryId);
    if (marketId) whereClause.marketId = Number(marketId);

    const products = await prisma.product.findMany({
      where: whereClause,
      orderBy: { createdAt: "desc" },
      include: { category: true, market: true, farmer: true },
    });

    return NextResponse.json({ success: true, data: products });
  } catch (error) {
    console.error("❌ GET FARMER PRODUCTS ERROR:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch products",
        error: error?.message || String(error),
      },
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

    // Convert numbers safely
    const price = Number(body.price) || 0;
    const salePrice = Number(body.salePrice) || 0;
    const productStock = Number(body.productStock) || 0;
    const qty = Number(body.qty) || 1;
    const wholesalePrice = Number(body.wholesalePrice) || 0;
    const wholesaleQty = Number(body.wholesaleQty) || 0;

    const product = await prisma.product.create({
      data: {
        title: body.title,
        slug: body.slug || body.title.toLowerCase().replace(/\s+/g, "-"),
        description: body.description || "",
        price,
        salePrice,
        productStock,
        qty,
        imageUrl: Array.isArray(body.productImages)
          ? body.productImages[0]
          : body.imageUrl || "",
        productImages: body.productImages || [],
        tags: body.tags || [],
        productCode: body.productCode || "",
        sku: body.sku || "",
        barcode: body.barcode || "",
        unit: body.unit || "",
        isWholesale: !!body.isWholesale,
        wholesalePrice,
        wholesaleQty,
        isActive: body.isActive ?? true,
        phoneNumber: body.phoneNumber || "",
        location: body.location || "",

        farmer: { connect: { id: body.farmerId } },
        category: body.categoryId
          ? { connect: { id: Number(body.categoryId) } }
          : undefined,
        market: body.marketId
          ? { connect: { id: Number(body.marketId) } }
          : undefined,
      },
      include: {
        category: true,
        market: true,
        farmer: true,
      },
    });

    return NextResponse.json({ success: true, data: product }, { status: 201 });
  } catch (error) {
    console.error("❌ CREATE PRODUCT ERROR:", error);
    return NextResponse.json(
      { success: false, message: error?.message || "Failed to create product" },
      { status: 500 }
    );
  }
}
