export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prismadb";
import { NextResponse } from "next/server";

export async function GET(request) {
  const sortBy = request.nextUrl.searchParams.get("sort");
  const min = request.nextUrl.searchParams.get("min");
  const max = request.nextUrl.searchParams.get("max");
  const searchTerm = request.nextUrl.searchParams.get("search") || "";
  const categoryId = request.nextUrl.searchParams.get("catId");
  const page = parseInt(request.nextUrl.searchParams.get("page") || "1");
  const pageSize = 3;

  let where = {};

  if (categoryId) where.category = categoryId;
  if (searchTerm) {
    where.OR = [
      { title: { contains: searchTerm, mode: "insensitive" } },
      { description: { contains: searchTerm, mode: "insensitive" } },
    ];
  }
  if (min && max) where.salePrice = { gte: parseFloat(min), lte: parseFloat(max) };
  else if (min) where.salePrice = { gte: parseFloat(min) };
  else if (max) where.salePrice = { lte: parseFloat(max) };

  const products = await prisma.products.findMany({
    where,
    skip: (page - 1) * pageSize,
    take: pageSize,
    orderBy: { salePrice: sortBy === "asc" ? "asc" : "desc" },
  });

  return NextResponse.json(products);
}
