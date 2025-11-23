import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    const [
      farmers,
      sales,
      supports
    ] = await Promise.all([
      prisma.farmers.findMany({
        orderBy: { createdAt: "desc" },
        take: 5, // Latest 5 farmers
      }),

      prisma.sales.findMany({
        orderBy: { createdAt: "desc" },
        take: 5, // Latest 5 sales
      }),

      prisma.farmerSupport.count(), // support tickets count
    ]);

    return NextResponse.json({
      success: true,
      data: {
        totalFarmers: farmers.length,
        totalSales: await prisma.sales.count(),
        totalSupport: supports,
        latestFarmers: farmers,
        latestSales: sales,
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
