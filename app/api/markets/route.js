import { prisma } from "@/lib/prismadb";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { title, slug, logoUrl, description, isActive, categoryIds } =
      await request.json();

    const existingMarket = await prisma.markets.findUnique({
      where: { slug },
    });

    if (existingMarket) {
      return NextResponse.json(
        {
          data: null,
          message: `Market (${title}) already exists in the database`,
        },
        { status: 409 }
      );
    }

    const newMarket = await prisma.markets.create({
      data: { title, slug, logoUrl, description, isActive, categoryIds },
    });

    console.log(newMarket);
    return NextResponse.json(newMarket);
  } catch (error) {
    console.error("POST /api/markets failed:", error);
    return NextResponse.json(
      { message: "Failed to create Market", error: error.message },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const markets = await prisma.markets.findMany({
      orderBy: { date: "desc" }, // use 'date' field from your schema
    });

    return NextResponse.json(markets);
  } catch (error) {
    console.error("GET /api/markets failed:", error);
    return NextResponse.json(
      { message: "Failed to fetch Markets", error: error.message },
      { status: 500 }
    );
  }
}
