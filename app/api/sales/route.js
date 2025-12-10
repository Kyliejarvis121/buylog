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
    const sales = await prisma.sale.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        product: true, // if your Sale has a product relation
        farmer: true,  // if your Sale has a farmer relation
        user: true,    // if your Sale has a user relation
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
        message: "Failed to fetch sales",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
