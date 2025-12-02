import { prisma } from "@/lib/prismadb";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const sales = await prisma.sale.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      success: true,
      data: sales, // MUST be an array
    });
  } catch (error) {
    console.error("SALES API ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        data: [], // MUST NOT be null
        message: "Failed to fetch sales",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
