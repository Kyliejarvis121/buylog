export const dynamic = "force-dynamic";
export const revalidate = 0;

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
      data: {
        title,
        link: link?.trim() || null,
        imageUrl,
        isActive: Boolean(isActive ?? true),
      },
    });

    return NextResponse.json({
      data: newBanner,
      message: "Banner created successfully",
    }, { status: 201 });
  } catch (error) {
    console.error("POST /api/banners failed:", error);
    return NextResponse.json({
      data: null,
      message: "Failed to create banner",
      error: error.message,
    }, { status: 500 });
  }
}

// GET ALL BANNERS
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);

    const page = Number(searchParams.get("page") || 1);
    const limit = Number(searchParams.get("limit") || 1000); // large number to fetch all
    const skip = (page - 1) * limit;
    const searchQuery = searchParams.get("q")?.trim() || "";

    const [banners, total] = await Promise.all([
      prisma.banner.findMany({
        where: searchQuery
          ? { title: { contains: searchQuery, mode: "insensitive" } }
          : undefined,
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.banner.count({
        where: searchQuery
          ? { title: { contains: searchQuery, mode: "insensitive" } }
          : undefined,
      }),
    ]);

    return NextResponse.json({
      success: true,
      data: banners,
      total,
      page,
      limit,
      message: `Fetched ${banners.length} banners out of ${total}`,
    });
  } catch (error) {
    console.error("GET /api/banners failed:", error);
    return NextResponse.json({
      success: false,
      data: [],
      message: "Failed to fetch banners",
      error: error.message,
    }, { status: 500 });
  }
}
