// Route: app/api/coupons/[id]/route.js
import { prisma } from "@/lib/prismadb";
import { NextResponse } from "next/server";

// GET SINGLE COUPON
export async function GET(request, { params: { id } }) {
  try {
    const coupon = await prisma.coupon.findUnique({ where: { id } });
    if (!coupon) return NextResponse.json({ data: null, message: "Coupon not found" }, { status: 404 });
    return NextResponse.json({ data: coupon });
  } catch (error) {
    console.error("GET /api/coupons/[id] failed:", error);
    return NextResponse.json({ data: null, message: "Failed to fetch coupon", error: error.message }, { status: 500 });
  }
}

// UPDATE COUPON
export async function PUT(request, { params: { id } }) {
  try {
    const { title, code, discount, expiry, isActive } = await request.json();
    const existingCoupon = await prisma.coupon.findUnique({ where: { id } });
    if (!existingCoupon) return NextResponse.json({ data: null, message: "Coupon not found" }, { status: 404 });

    const updatedCoupon = await prisma.coupon.update({
      where: { id },
      data: { title, code, discount, expiry: new Date(expiry), isActive },
    });

    return NextResponse.json({ data: updatedCoupon, message: "Coupon updated successfully" });
  } catch (error) {
    console.error("PUT /api/coupons/[id] failed:", error);
    return NextResponse.json({ data: null, message: "Failed to update coupon", error: error.message }, { status: 500 });
  }
}

// DELETE COUPON
export async function DELETE(request, { params: { id } }) {
  try {
    const existingCoupon = await prisma.coupon.findUnique({ where: { id } });
    if (!existingCoupon) return NextResponse.json({ data: null, message: "Coupon not found" }, { status: 404 });

    const deletedCoupon = await prisma.coupon.delete({ where: { id } });
    return NextResponse.json({ data: deletedCoupon, message: "Coupon deleted successfully" });
  } catch (error) {
    console.error("DELETE /api/coupons/[id] failed:", error);
    return NextResponse.json({ data: null, message: "Failed to delete coupon", error: error.message }, { status: 500 });
  }
}
