import { prisma } from "@/lib/prismadb";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({ data: products, message: `Found ${products.length} products` }, { status: 200 });
  } catch (error) {
    console.error("GET /api/products failed:", error);
    return NextResponse.json(
      {
        data: [],
        message: "Failed to fetch products",
        error: error?.message ?? String(error),
      },
      { status: 500 }
    );
  }
}
