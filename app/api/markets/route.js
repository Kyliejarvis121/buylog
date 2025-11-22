import { prisma } from "@/lib/prismadb";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { title, slug, logoUrl, description, isActive, categoryIds } = await request.json();

    if (slug) {
      const existing = await prisma.markets.findUnique({ where: { slug } });
      if (existing) return NextResponse.json({ data: null, message: `Market (${title}) already exists` }, { status: 409 });
    }

    const newMarket = await prisma.markets.create({ data: { title, slug, logoUrl, description, isActive, categoryIds } });
    return NextResponse.json({ data: newMarket, message: "Market created successfully" }, { status: 201 });
  } catch (error) {
    console.error("POST /api/markets failed:", error);
    return NextResponse.json({ data: null, message: "Failed to create Market", error: error.message }, { status: 500 });
  }
}

export async function GET() {
  try {
    const markets = await prisma.markets.findMany({ orderBy: { createdAt: "desc" } });
    return NextResponse.json({ data: markets, message: "Markets fetched successfully" });
  } catch (error) {
    console.error("GET /api/markets failed:", error);
    return NextResponse.json({ data: null, message: "Failed to fetch Markets", error: error.message }, { status: 500 });
  }
}
