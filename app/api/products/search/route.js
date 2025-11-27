import { prisma } from "@/lib/prismadb";
import { NextResponse } from "next/server";

// GET products by search query
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q") ?? "";

    const products = await prisma.product.findMany({
      where: { title: { contains: query, mode: "insensitive" } },
      include: { category: true, vendor: true },
    });

    return NextResponse.json({ data: products, message: `Found ${products.length} products` });
  } catch (error) {
    return NextResponse.json({ message: "Search failed", error: error.message }, { status: 500 });
  }
}
