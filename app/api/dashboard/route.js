import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    const [
      sales,
      orders,
      products,
      farmers,
    ] = await Promise.all([
      prisma.sales.findMany({ orderBy: { createdAt: "desc" } }),
      prisma.orders.findMany({ orderBy: { createdAt: "desc" } }),
      prisma.products.findMany({ orderBy: { createdAt: "desc" } }),
      prisma.farmers.findMany({ orderBy: { createdAt: "desc" } }),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        // Full dataset
        sales,
        orders,
        products,
        farmers,

        // Dashboard stats
        totalSales: sales.length,
        totalOrders: orders.length,
        totalProducts: products.length,
        totalFarmers: farmers.length,

        // Latest entries
        latestOrders: orders.slice(0, 5),
        latestProducts: products.slice(0, 5),
        latestFarmers: farmers.slice(0, 5),
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
