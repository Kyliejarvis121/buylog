import { prisma } from "@/lib/prismadb";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const sales = await prisma.sales.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
    return NextResponse.json(sales);
  } catch (error) {
    console.error("Failed to fetch sales:", error);
    return NextResponse.json(
      {
        message: "Failed to fetch Sales",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
