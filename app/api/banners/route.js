// Route: app/api/banners/route.js
import { prisma } from "@/lib/prismadb";
import { NextResponse } from "next/server";

// CREATE BANNER
export async function POST(request) {
  try {
    const { title, link, imageUrl, isActive } = await request.json();

    if (!title || !imageUrl) {
      return NextResponse.json(
        { data: null, message: "Title and imageUrl are required" },
        { status: 400 }
      );
    }

    const newBanner = await prisma.banner.create({
      data: { title, link: link ?? "", imageUrl, isActive: Boolean(isActive) },
    });

    return NextResponse.json(
      { data: newBanner, message: "Banner created successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/banners failed:", error);
    return NextResponse.json(
      { data: null, message: "Failed to create Banner", error: error.message },
      { status: 500 }
    );
  }
}

// GET ALL BANNERS with pagination
export async function GET(request) {
  try {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get("page") ?? "1");
    const limit = parseInt(url.searchParams.get("limit") ?? "20");
    const skip = (page - 1) * limit;

    const banners = await prisma.banner.findMany({
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    });

    const total = await prisma.banner.count();

    return NextResponse.json({
      data: banners,
      total,
      page,
      limit,
      message: `Fetched ${banners.length} banners out of ${total}`,
    });
  } catch (error) {
    console.error("GET /api/banners failed:", error);
    return NextResponse.json(
      { data: [], message: "Failed to fetch banners", error: error.message },
      { status: 500 }
    );
  }
}
