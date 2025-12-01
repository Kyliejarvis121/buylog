import { NextResponse } from "next/server";
import { prisma } from "@/lib/prismadb";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

// GET all coupons
export async function GET() {
  try {
    const coupons = await prisma.coupon.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ data: coupons });
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to fetch coupons", error: error.message },
      { status: 500 }
    );
  }
}

// CREATE coupon
export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session)
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );

    const body = await req.json();
    const { code, discount, vendorId } = body;

    const newCoupon = await prisma.coupon.create({
      data: {
        code,
        discount,
        vendorId: vendorId || session.user.id,
      },
    });

    return NextResponse.json({ data: newCoupon });
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to create coupon", error: error.message },
      { status: 500 }
    );
  }
}
