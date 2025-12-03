// app/api/products/route.js
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prismadb";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

export const dynamic = "force-dynamic";
export const revalidate = 0;

function normalizeProductPayload(body) {
  // map incoming fields to your Prisma model fields
  const price =
    body.price ?? body.salePrice ?? body.productPrice
      ? parseFloat(body.price ?? body.salePrice ?? body.productPrice)
      : undefined;

  return {
    title: body.title,
    slug: body.slug ?? null,
    description: body.description ?? null,
    price: price ?? 0,
    categoryId: body.categoryId ?? null,
    farmerId: body.farmerId ?? null,
    imageUrl: body.imageUrl ?? (Array.isArray(body.productImages) && body.productImages[0]) ?? null,
    productImages: Array.isArray(body.productImages) ? body.productImages : body.productImages ? [body.productImages] : [],
    isActive: body.isActive ?? true,
    // keep extra fields if present (sku, barcode, tags, qty, productCode) in database-free fields
    // but Prisma schema must have matching fields to save them — adjust if you added those fields.
  };
}

// GET /api/products  -> list (supports pagination & search)
export async function GET(request) {
  try {
    const url = new URL(request.url);
    const q = url.searchParams.get("q") ?? url.searchParams.get("search") ?? "";
    const page = parseInt(url.searchParams.get("page") || "1");
    const limit = parseInt(url.searchParams.get("limit") || "20");
    const skip = (page - 1) * limit;
    const sort = url.searchParams.get("sort") || "desc";

    const where = {};
    if (q) {
      // basic text search on title/description
      where.OR = [
        { title: { contains: q, mode: "insensitive" } },
        { description: { contains: q, mode: "insensitive" } },
      ];
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: { category: true },
        orderBy: { createdAt: sort === "asc" ? "asc" : "desc" },
        skip,
        take: limit,
      }),
      prisma.product.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: products,
      meta: { total, page, limit },
    });
  } catch (error) {
    console.error("GET /api/products error:", error);
    return NextResponse.json({ success: false, message: "Failed to list products", error: error.message }, { status: 500 });
  }
}

// POST /api/products -> create
export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });

    const body = await request.json();
    const payload = normalizeProductPayload(body);

    // minimal validation
    if (!payload.title) {
      return NextResponse.json({ success: false, message: "Title is required" }, { status: 400 });
    }
    if (!payload.farmerId) {
      // if this is an admin creating for someone else, we expect farmerId; otherwise use session id as farmer
      if (session.user?.role === "FARMER") {
        payload.farmerId = session.user.id;
      } else {
        return NextResponse.json({ success: false, message: "farmerId is required for product creation" }, { status: 400 });
      }
    }

    // ensure farmer exists
    const farmer = await prisma.farmer.findUnique({ where: { id: payload.farmerId } });
    if (!farmer) return NextResponse.json({ success: false, message: "Farmer not found" }, { status: 404 });

    // Create product
    const newProduct = await prisma.product.create({
      data: {
        title: payload.title,
        slug: payload.slug,
        description: payload.description,
        price: payload.price,
        categoryId: payload.categoryId,
        farmerId: payload.farmerId,
        imageUrl: payload.imageUrl,
        productImages: payload.productImages,
        isActive: payload.isActive,
      },
    });

    return NextResponse.json({ success: true, message: "Product created", data: newProduct }, { status: 201 });
  } catch (error) {
    console.error("POST /api/products error:", error);
    return NextResponse.json({ success: false, message: "Failed to create product", error: error.message }, { status: 500 });
  }
}
