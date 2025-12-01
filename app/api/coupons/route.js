import { prisma } from "@/lib/prismadb";
import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth"; // <- you must already have this

// ----------------------
// CREATE COUPON (ADMIN ONLY)
// ----------------------
export async function POST(request) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    if (user.role !== "ADMIN") {
      return NextResponse.json(
        { message: "Only admins can create coupons" },
        { status: 403 }
      );
    }

    const { title, code, discount, expiry, isActive, vendorId } =
      await request.json();

    // Basic validation
    if (!title || !code || discount == null || !expiry) {
      return NextResponse.json(
        { message: "Title, code, discount, and expiry are required" },
        { status: 400 }
      );
    }

    // Ensure unique coupon code
    const existing = await prisma.coupon.findUnique({ where: { code } });
    if (existing) {
      return NextResponse.json(
        { message: `Coupon code (${code}) already exists` },
        { status: 409 }
      );
    }

    // Create coupon
    const coupon = await prisma.coupon.create({
      data: {
        title,
        code,
        discount: Number(discount),
        expiry: new Date(expiry),
        isActive: Boolean(isActive),
        vendorId: vendorId || null,
      },
    });

    return NextResponse.json(
      { data: coupon, message: "Coupon created successfully" },
      { status: 201 }
    );

  } catch (error) {
    console.error("POST /api/coupons error:", error);
    return NextResponse.json(
      { message: "Failed to create coupon", error: error.message },
      { status: 500 }
    );
  }
}


// ----------------------
// GET COUPONS (ADMIN ONLY)
// ----------------------
export async function GET(request) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    if (user.role !== "ADMIN") {
      return NextResponse.json(
        { message: "Only admins can view coupons" },
        { status: 403 }
      );
    }

    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get("page") || "1");
    const limit = parseInt(url.searchParams.get("limit") || "20");
    const skip = (page - 1) * limit;

    const [coupons, total] = await Promise.all([
      prisma.coupon.findMany({
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.coupon.count(),
    ]);

    return NextResponse.json({
      data: coupons,
      total,
      page,
      limit,
      message: "Coupons fetched successfully",
    });

  } catch (error) {
    console.error("GET /api/coupons error:", error);
    return NextResponse.json(
      { message: "Failed to fetch coupons", error: error.message },
      { status: 500 }
    );
  }
}
