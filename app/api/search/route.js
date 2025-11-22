import { prisma } from "@/lib/prismadb";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const sortBy = request.nextUrl.searchParams.get("sort") || "desc";
    const min = request.nextUrl.searchParams.get("min");
    const max = request.nextUrl.searchParams.get("max");
    const searchTerm = request.nextUrl.searchParams.get("search") || "";
    const categoryId = request.nextUrl.searchParams.get("catId");
    const page = parseInt(request.nextUrl.searchParams.get("page") || "1", 10);
    const pageSize = 3;

    // Build the "where" clause
    const where = {};

    if (categoryId) {
      where.categoryId = categoryId; // match your schema field
    }

    if (searchTerm) {
      where.OR = [
        { title: { contains: searchTerm, mode: "insensitive" } },
        { description: { contains: searchTerm, mode: "insensitive" } },
      ];
    }

    if (min || max) {
      where.price = {};
      if (min) where.price.gte = parseFloat(min);
      if (max) where.price.lte = parseFloat(max);
    }

    // Fetch products
    const products = await prisma.products.findMany({
      where,
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: {
        price: sortBy === "asc" ? "asc" : "desc", // match schema
      },
    });

    return NextResponse.json({
      data: products,
      message: "Products fetched successfully",
      page,
      pageSize,
    });
  } catch (error) {
    console.error("GET /api/products failed:", error);
    return NextResponse.json(
      { data: null, message: "Failed to fetch products", error: error.message },
      { status: 500 }
    );
  }
}
