import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    const [sales, orders, products] = await Promise.all([
      prisma.sales.findMany({ orderBy: { createdAt: "desc" } }),
      prisma.orders.findMany({ orderBy: { createdAt: "desc" } }),
      prisma.products.findMany({ orderBy: { createdAt: "desc" } }),
    ]);

    // IMPORTANT FIX — Return raw arrays, not a nested data object
    return NextResponse.json({
      sales,
      orders,
      products,
    });
  } catch (error) {
    console.error("DASHBOARD API ERROR:", error);
    return NextResponse.json(
      { error: "Failed to load dashboard data" },
      { status: 500 }
    );
  }
}
