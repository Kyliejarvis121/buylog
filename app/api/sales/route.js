import { prisma } from "@/lib/prismadb";
import { NextResponse } from "next/server";

// Convert BigInt fields safely
function safeJson(obj) {
  return JSON.parse(
    JSON.stringify(obj, (_, value) =>
      typeof value === "bigint" ? value.toString() : value
    )
  );
}

export async function GET() {
  try {
    const sales = await prisma.order.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        items: {
          include: {
            product: true, // include product details for each order item
          },
        },
        user: true, // include user who placed the order
      },
    });

    return NextResponse.json({
      success: true,
      data: safeJson(sales), // ensures no BigInt issues
    });
  } catch (error) {
    console.error("❌ SALES API ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        data: [],
        message: error.message || "Failed to fetch sales",
      },
      { status: 500 }
    );
  }
}
