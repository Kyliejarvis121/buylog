import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    // Fetch everything needed for dashboard
    const [sales, orders, products, farmers] = await Promise.all([
      prisma.sales.findMany({ orderBy: { createdAt: "desc" } }),
      prisma.orders.findMany({ orderBy: { createdAt: "desc" } }),
      prisma.products.findMany({ orderBy: { createdAt: "desc" } }),
      prisma.farmers.findMany({ orderBy: { createdAt: "desc" } }),
    ]);

    // Build dashboard data
    const dashboardData = {
      latestSales: sales.slice(0, 5),
      latestOrders: orders.slice(0, 5),
      latestFarmers: farmers.slice(0, 5),

      totalSales: sales.length,
      totalOrders: orders.length,
      totalProducts: products.length,
      totalFarmers: farmers.length,

      sales,
      orders,
      products,
      farmers,
    };

    return NextResponse.json({
      success: true,
      data: dashboardData,
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
