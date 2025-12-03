export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prismadb";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const url = new URL(request.url);

    const query = url.searchParams.get("q")?.trim() ?? "";
    const page = parseInt(url.searchParams.get("page") ?? "1");
    const limit = parseInt(url.searchParams.get("limit") ?? "20");
    const skip = (page - 1) * limit;

    if (!query) {
      return NextResponse.json(
        { data: [], message: "Please provide a search query" },
        { status: 400 }
      );
    }

    const products = await prisma.product.findMany({
      where: { title: { contains: query, mode: "insensitive" } },
      include: { category: true }, // ✅ FIXED: remove vendor
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
    });

    const total = await prisma.product.count({
      where: { title: { contains: query, mode: "insensitive" } },
    });

    return NextResponse.json({
      data: products,
      total,
      page,
      limit,
      message: `Found ${products.length} products out of ${total}`,
    });
  } catch (error) {
    console.error("Search API error:", error);
    return NextResponse.json(
      { message: "Search failed", error: error.message },
      { status: 500 }
    );
  }
}
