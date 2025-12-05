import { prisma } from "@/lib/prismadb"; // Use prisma client
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const url = request.nextUrl;
    const searchTerm = url.searchParams.get("search") || "";
    const sortBy = url.searchParams.get("sort") || "asc";
    const min = url.searchParams.get("min");
    const max = url.searchParams.get("max");
    const page = parseInt(url.searchParams.get("page") || "1");
    const pageSize = 3;

    // Build the where clause
    const where = {
      OR: [
        { title: { contains: searchTerm, mode: "insensitive" } },
        { description: { contains: searchTerm, mode: "insensitive" } },
        {
          category: {
            title: { contains: searchTerm, mode: "insensitive" },
          },
        },
      ],
      AND: [],
    };

    // Add price filtering
    if (min || max) {
      const priceFilter = {};
      if (min) priceFilter.gte = parseFloat(min);
      if (max) priceFilter.lte = parseFloat(max);
      where.AND.push({ salePrice: priceFilter });
    }

    // Fetch products with pagination and sorting
    const products = await prisma.product.findMany({
      where,
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: {
        salePrice: sortBy === "asc" ? "asc" : "desc",
      },
      include: { category: true, farmer: true }, // Include relations for frontend
    });

    return NextResponse.json({ success: true, data: products });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch products", error },
      { status: 500 }
    );
  }
}
