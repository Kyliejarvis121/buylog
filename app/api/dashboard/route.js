import { NextResponse } from "next/server";
import prisma from "@/lib/db";

// FORCE DYNAMIC (important)
export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    const [sales, orders, products] = await Promise.all([
      prisma.sales.findMany({ orderBy: { createdAt: "desc" } }),
      prisma.orders.findMany({ orderBy: { createdAt: "desc" } }),
      prisma.products.findMany({ orderBy: { createdAt: "desc" } }),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        sales,
        orders,
        products,
      },
    });
  } catch (error) {
    console.error("DASHBOARD API ERROR:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to load dashboard data",
        error: error.message,
      },
      { status: 500 }
    );
  }
}