// Route: app/api/banners/route.js

export const dynamic = "force-dynamic";
export const revalidate = 0;

import { prisma } from "@/lib/prismadb";
import { NextResponse } from "next/server";

// CREATE BANNER
export async function POST(request) {
  try {
    const body = await request.json();
    const { title, link, imageUrl, isActive } = body;

    // Validate required fields
    if (!title || !imageUrl) {
      return NextResponse.json(
        {
          data: null,
          message: "Title and imageUrl are required",
        },
        { status: 400 }
      );
    }

    const newBanner = await prisma.banner.create({
      data: {
        title,
        link: link || "",
        imageUrl,
        isActive: Boolean(isActive),
      },
    });

    return NextResponse.json(
      {
        data: newBanner,
        message: "Banner created successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/banners failed:", error);
    return NextResponse.json(
      {
        data: null,
        message: "Failed to create banner",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

// GET ALL BANNERS (with pagination)
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);

    const page = Number(searchParams.get("page") || 1);
    const limit = Number(searchParams.get("limit") || 20);
    const skip = (page - 1) * limit;

    const [banners, total] = await Promise.all([
      prisma.banner.findMany({
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.banner.count(),
    ]);

    return NextResponse.json({
      data: banners,
      total,
      page,
      limit,
      message: "Banners fetched successfully",
    });
  } catch (error) {
    console.error("GET /api/banners failed:", error);
    return NextResponse.json(
      {
        data: [],
        message: "Failed to fetch banners",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
