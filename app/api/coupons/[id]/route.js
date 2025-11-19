import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(request, { params: { id } }) {
  try {
    const coupon = await prisma.coupon.findUnique({ where: { id } });
    return NextResponse.json(coupon);
  } catch (error) {
    console.error("Failed to fetch coupon:", error);
    return NextResponse.json(
      { message: "Failed to Fetch Coupon", error: error.message || error },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params: { id } }) {
  try {
    const existingCoupon = await prisma.coupon.findUnique({ where: { id } });
    if (!existingCoupon) {
      return NextResponse.json(
        { data: null, message: "Coupon Not Found" },
        { status: 404 }
      );
    }

    const deletedCoupon = await prisma.coupon.delete({ where: { id } });
    return NextResponse.json(deletedCoupon);
  } catch (error) {
    console.error("Failed to delete coupon:", error);
    return NextResponse.json(
      { message: "Failed to Delete Coupon", error: error.message || error },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params: { id } }) {
  try {
    const { title, couponCode, expiryDate, isActive } = await request.json();

    const existingCoupon = await prisma.coupon.findUnique({ where: { id } });
    if (!existingCoupon) {
      return NextResponse.json(
        { data: null, message: "Coupon Not Found" },
        { status: 404 }
      );
    }

    const updatedCoupon = await prisma.coupon.update({
      where: { id },
      data: { title, couponCode, expiryDate, isActive },
    });

    return NextResponse.json(updatedCoupon);
  } catch (error) {
    console.error("Failed to update coupon:", error);
    return NextResponse.json(
      { message: "Failed to Update Coupon", error: error.message || error },
      { status: 500 }
    );
  }
}
