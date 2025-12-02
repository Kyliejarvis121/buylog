import { prisma } from "@/lib/prismadb";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      include: { category: true },
      orderBy: { createdAt: "desc" },
    });

    const totalProducts = await prisma.product.count();

    return NextResponse.json({
      success: true,
      data: products || [],   // ALWAYS array
      totalProducts,
    });
  } catch (error) {
    console.error("GET /api/products failed:", error);

    return NextResponse.json(
      {
        success: false,
        data: [],               // MUST be array
        message: "Failed to fetch products",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
