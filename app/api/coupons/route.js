import { prisma } from "@/lib/prismadb";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { title, code, discount, expiry, isActive, vendorId } =
      await request.json();

    // Check if coupon already exists
    const existingCoupon = await prisma.coupons.findUnique({
      where: { code },
    });

    if (existingCoupon) {
      return NextResponse.json(
        { data: null, message: `Coupon with code (${code}) already exists` },
        { status: 409 }
      );
    }

    const newCoupon = await prisma.coupons.create({
      data: {
        code,
        discount,
        expiry: new Date(expiry),
        isActive,
        vendorId,
      },
    });

    console.log("Created coupon:", newCoupon);
    return NextResponse.json({ data: newCoupon, message: "Coupon created successfully" });
  } catch (error) {
    console.error("POST /api/coupons failed:", error);
    return NextResponse.json(
      { data: null, message: "Failed to create coupon", error: error.message },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const coupons = await prisma.coupons.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ data: coupons, message: "Coupons fetched successfully" });
  } catch (error) {
    console.error("GET /api/coupons failed:", error);
    return NextResponse.json(
      { data: null, message: "Failed to fetch coupons", error: error.message },
      { status: 500 }
    );
  }
}
