import { prisma } from "@/lib/prismadb";
import { NextResponse } from "next/server";




// DELETE /api/products/:id
export async function DELETE(req, { params }) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Product ID is required" },
        { status: 400 }
      );
    }

    // Delete the product
    await prisma.product.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: "Product deleted successfully" });
  } catch (error) {
    console.error("❌ DELETE PRODUCT ERROR:", error);
    return NextResponse.json(
      { success: false, message: error?.message || "Failed to delete product" },
      { status: 500 }
    );
  }
}


// 🚀 API to CREATE or UPDATE a product
export async function POST(req) {
  try {
    const body = await req.json();

    // Validate required fields
    if (!body.title || !body.farmerId) {
      return NextResponse.json(
        { success: false, message: "Title and farmerId are required" },
        { status: 400 }
      );
    }

    // Safely parse numbers
    const price = Number(body.price) || 0;
    const salePrice = Number(body.salePrice) || 0;
    const productStock = Number(body.productStock) || 0;
    const qty = Number(body.qty) || 1;
    const wholesalePrice = Number(body.wholesalePrice) || 0;
    const wholesaleQty = Number(body.wholesaleQty) || 0;

    // Only include valid categoryId & marketId
    const categoryConnect = body.categoryId && body.categoryId !== "String"
      ? { connect: { id: body.categoryId } }
      : undefined;

    const marketConnect = body.marketId && body.marketId !== "String"
      ? { connect: { id: body.marketId } }
      : undefined;

    let product;

    if (body.id) {
      // 🔄 Update existing product
      product = await prisma.product.update({
        where: { id: body.id },
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
          category: categoryConnect,
          market: marketConnect,
        },
        include: { category: true, market: true, farmer: true },
      });
    } else {
      // ➕ Create new product
      product = await prisma.product.create({
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
          category: categoryConnect,
          market: marketConnect,
        },
        include: { category: true, market: true, farmer: true },
      });
    }

    return NextResponse.json({ success: true, data: product }, { status: 201 });
  } catch (error) {
    console.error("❌ CREATE/UPDATE PRODUCT ERROR:", error);
    return NextResponse.json(
      { success: false, message: error?.message || "Failed to save product" },
      { status: 500 }
    );
  }
}

// GET all products (optional pagination & filters)
export async function GET(req) {
  try {
    const url = new URL(req.url);
    const page = Number(url.searchParams.get("page") || 1);
    const limit = Number(url.searchParams.get("limit") || 20);
    const farmerId = url.searchParams.get("farmerId"); // optional filter
    const categoryId = url.searchParams.get("categoryId"); // optional

    const whereClause = {};
    if (farmerId) whereClause.farmerId = farmerId;
    if (categoryId) whereClause.categoryId = categoryId;

    const products = await prisma.product.findMany({
      where: whereClause,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
      include: { category: true, market: true, farmer: true },
    });

    return NextResponse.json({ success: true, data: products });
  } catch (error) {
    console.error("❌ GET PRODUCTS ERROR:", error);
    return NextResponse.json(
      { success: false, message: error?.message || "Failed to fetch products" },
      { status: 500 }
    );
  }
}
