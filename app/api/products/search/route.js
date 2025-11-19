import { prisma } from "@/lib/prismadb";
import { NextResponse } from "next/server";

export async function GET(request) {
  const searchTerm = request.nextUrl.searchParams.get("search") || "";
  const sortBy = request.nextUrl.searchParams.get("sort");
  const min = request.nextUrl.searchParams.get("min");
  const max = request.nextUrl.searchParams.get("max");
  const page = parseInt(request.nextUrl.searchParams.get("page") || "1");
  const pageSize = 3;

  let where = {
    OR: [
      { title: { contains: searchTerm, mode: "insensitive" } },
      { description: { contains: searchTerm, mode: "insensitive" } },
    ],
  };

  if (min && max) {
    where.salePrice = {
      gte: parseFloat(min),
      lte: parseFloat(max),
    };
  } else if (min) {
    where.salePrice = { gte: parseFloat(min) };
  } else if (max) {
    where.salePrice = { lte: parseFloat(max) };
  }

  try {
    const products = await prisma.products.findMany({
      where,
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: {
        salePrice: sortBy === "asc" ? "asc" : "desc",
      },
    });

    return NextResponse.json(products);
  } catch (error) {
    console.error("Failed to fetch products:", error);
    return NextResponse.json(
      { message: "Failed to Fetch Products", error: error.message },
      { status: 500 }
    );
  }
}
