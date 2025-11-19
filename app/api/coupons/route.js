import { prisma } from "@/lib/prismadb";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { title, couponCode, expiryDate, isActive, vendorId } =
      await request.json();

    // Use prisma instead of db
    const newCoupon = await prisma.coupons.create({  // ❗ ensure model is correct
      data: {
        title,
        couponCode,
        expiryDate: new Date(expiryDate), // convert if needed
        isActive,
        vendorId,
      },
    });

    console.log(newCoupon);
    return NextResponse.json(newCoupon);
  } catch (error) {
    console.error("POST /api/coupons failed:", error);
    return NextResponse.json(
      {
        message: "Failed to create Coupon",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const coupons = await prisma.coupons.findMany({  // ❗ use prisma
      orderBy: {
        createdAt: "desc",
      },
    });
    return NextResponse.json(coupons);
  } catch (error) {
    console.error("GET /api/coupons failed:", error);
    return NextResponse.json(
      {
        message: "Failed to fetch Coupon",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
