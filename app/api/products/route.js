import { prisma } from "@/lib/prismadb";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

export async function POST(request) {
  try {
    // get session (NextAuth)
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const user = session.user;
    // allow only FARMER or ADMIN
    const allowedRoles = ["FARMER", "ADMIN"];
    if (!allowedRoles.includes((user.role || "").toUpperCase())) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const {
      title,
      slug,
      description,
      price,
      categoryId,
      productImages = [],
      isActive = true,
      // other fields...
    } = body;

    // check slug uniqueness
    if (slug) {
      const exists = await prisma.products.findUnique({ where: { slug } });
      if (exists) {
        return NextResponse.json({ message: "Product slug already exists" }, { status: 409 });
      }
    }

    const farmerId = user.role?.toUpperCase() === "FARMER" ? user.id : body.farmerId ?? null;
    // NOTE: if your user.id is not the farmerId stored in farmers.userId, you might need to query farmer by userId.

    const created = await prisma.products.create({
      data: {
        title,
        slug,
        description,
        price: parseFloat(price || 0),
        categoryId: categoryId || null,
        farmerId: farmerId,
        productImages,
        imageUrl: productImages?.[0] || null,
        isActive,
      },
    });

    // If farmer model stores product IDs in farmers.products array, push it:
    if (farmerId) {
      try {
        await prisma.farmers.update({
          where: { id: farmerId },
          data: {
            products: { push: created.id },
          },
        });
      } catch (err) {
        // not fatal; just log
        console.error("Failed to update farmer.products:", err);
      }
    }

    return NextResponse.json({ data: created, message: "Product created" }, { status: 201 });
  } catch (error) {
    console.error("POST /api/products failed:", error);
    return NextResponse.json({ message: "Failed to create product", error: String(error) }, { status: 500 });
  }
}

export async function GET(request) {
  try {
    const categoryId = request.nextUrl.searchParams.get("catId");
    const sortBy = request.nextUrl.searchParams.get("sort");
    const min = request.nextUrl.searchParams.get("min");
    const max = request.nextUrl.searchParams.get("max");
    const page = parseInt(request.nextUrl.searchParams.get("page") || "1");
    const pageSize = parseInt(request.nextUrl.searchParams.get("pageSize") || "12");

    // Build filter safely
    const where = {};
    if (categoryId) Object.assign(where, { categoryId });
    if (min && max) {
      Object.assign(where, { price: { gte: parseFloat(min), lte: parseFloat(max) } });
    } else if (min) {
      Object.assign(where, { price: { gte: parseFloat(min) } });
    } else if (max) {
      Object.assign(where, { price: { lte: parseFloat(max) } });
    }

    const products = await prisma.products.findMany({
      where,
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: sortBy === "asc" ? { price: "asc" } : { createdAt: "desc" },
    });

    return NextResponse.json({ data: products, message: "Products fetched" });
  } catch (error) {
    console.error("GET /api/products failed:", error);
    return NextResponse.json({ message: "Failed to Fetch Products", error: String(error) }, { status: 500 });
  }
}

