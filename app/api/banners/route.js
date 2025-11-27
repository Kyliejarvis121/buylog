// Route: app/api/banners/route.js
import { prisma } from "@/lib/prismadb";
import { NextResponse } from "next/server";

// CREATE BANNER
export async function POST(request) {
  try {
    const { title, link, imageUrl, isActive } = await request.json();

    const newBanner = await prisma.banner.create({
      data: { title, link, imageUrl, isActive },
    });

    return NextResponse.json({ data: newBanner, message: "Banner created successfully" }, { status: 201 });
  } catch (error) {
    console.error("POST /api/banners failed:", error);
    return NextResponse.json({ data: null, message: "Failed to create Banner", error: error.message }, { status: 500 });
  }
}

// GET ALL BANNERS
export async function GET() {
  try {
    const banners = await prisma.banner.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ data: banners, message: "Banners fetched successfully" });
  } catch (error) {
    console.error("GET /api/banners failed:", error);
    return NextResponse.json({ data: [], message: "Failed to fetch banners", error: error.message }, { status: 500 });
  }
}
