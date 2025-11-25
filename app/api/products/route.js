import { prisma } from "@/lib/prismadb";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      orderBy: { createdAt: "desc" },
      include: { category: true },
    });

    return NextResponse.json({ data: products, message: "Products fetched successfully" });
  } catch (error) {
    console.error("GET /api/products failed:", error);
    return NextResponse.json({ data: null, message: "Failed to fetch products", error: error.message }, { status: 500 });
  }
}