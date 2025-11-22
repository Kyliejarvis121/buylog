import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

export async function GET() {
  try {
    const totalFarmers = await db.farmer.count();
    const totalSales = await db.sale.count();
    const totalSupport = await db.support.count();

    const latestFarmers = await db.farmer.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
    });

    const latestSales = await db.sale.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: { farmer: true },
    });

    return NextResponse.json({
      success: true,
      data: {
        totalFarmers,
        totalSales,
        totalSupport,
        latestFarmers,
        latestSales,
      }
    });
  } catch (error) {
    console.error("Dashboard error:", error);
    return NextResponse.json(
      { success: false, error: "Dashboard failed" },
      { status: 500 }
    );
  }
}
