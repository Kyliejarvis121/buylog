import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function PUT(request, { params: { id } }) {
  try {
    const { title, couponCode, expiryDate, isActive } = await request.json();

    const existingCoupon = await prisma.coupon.findUnique({
      where: { id },
    });

    if (!existingCoupon) {
      return NextResponse.json(
        { data: null, message: "Coupon Not Found" },
        { status: 404 }
      );
    }

    const updatedCoupon = await prisma.coupon.update({
      where: { id },
      data: {
        title,
        couponCode,
        expiryDate,
        isActive,
      },
    });

    return NextResponse.json(updatedCoupon);
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Failed to Update Coupon", error },
      { status: 500 }
    );
  }
}
