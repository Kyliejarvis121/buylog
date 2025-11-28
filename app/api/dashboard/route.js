import { NextResponse } from "next/server";
import { prisma } from "@/lib/db"; // ✅ Use the same client as dashboard

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      orderBy: { createdAt: "desc" },
      take: 10, // optional: latest 10 products
    });

    const totalProducts = await prisma.product.count();

    return NextResponse.json({
      success: true,
      data: {
        totalProducts,
        latestProducts: products,
      },
    });
  } catch (error) {
    console.error("GET /api/products failed:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch products",
        error: error?.message ?? String(error),
      },
      { status: 500 }
    );
  }
}
