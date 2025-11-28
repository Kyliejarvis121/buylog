// Route: app/api/coupons/route.js
import { prisma } from "@/lib/prismadb";
import { NextResponse } from "next/server";

// CREATE COUPON
export async function POST(request) {
  try {
    const { title, code, discount, expiry, isActive, vendorId } = await request.json();

    // Validate required fields
    if (!title || !code || discount == null || !expiry) {
      return NextResponse.json(
        { data: null, message: "Title, code, discount, and expiry are required" },
        { status: 400 }
      );
    }

    // Check if coupon already exists
    const existingCoupon = await prisma.coupon.findUnique({ where: { code } });
    if (existingCoupon) {
      return NextResponse.json(
        { data: null, message: `Coupon with code (${code}) already exists` },
        { status: 409 }
      );
    }

    const newCoupon = await prisma.coupon.create({
      data: {
        title,
        code,
        discount: Number(discount),
        expiry: new Date(expiry),
        isActive: Boolean(isActive),
        vendorId: vendorId ?? null,
      },
    });

    return NextResponse.json(
      { data: newCoupon, message: "Coupon created successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/coupons failed:", error);
    return NextResponse.json(
      { data: null, message: "Failed to create coupon", error: error.message },
      { status: 500 }
    );
  }
}

// GET ALL COUPONS WITH PAGINATION
export async function GET(request) {
  try {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get("page") ?? "1");
    const limit = parseInt(url.searchParams.get("limit") ?? "20");
    const skip = (page - 1) * limit;

    const coupons = await prisma.coupon.findMany({
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    });

    const total = await prisma.coupon.count();

    return NextResponse.json({
      data: coupons,
      total,
      page,
      limit,
      message: `Fetched ${coupons.length} coupons out of ${total}`,
    });
  } catch (error) {
    console.error("GET /api/coupons failed:", error);
    return NextResponse.json(
      { data: [], message: "Failed to fetch coupons", error: error.message },
      { status: 500 }
    );
  }
}
