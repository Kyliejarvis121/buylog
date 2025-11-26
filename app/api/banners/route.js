import { prisma } from "@/lib/prismadb";
import { NextResponse } from "next/server";

// CREATE BANNER
export async function POST(request) {
  try {
    const { title, link, imageUrl } = await request.json();

    const newBanner = await prisma.banner.create({
      data: {
        title,
        link,
        imageUrl,
      },
    });

    return NextResponse.json(newBanner, { status: 201 });
  } catch (error) {
    console.error("POST /api/banners failed:", error);
    return NextResponse.json(
      {
        error: "Failed to create Banner",
        details: error.message,
      },
      { status: 500 }
    );
  }
}

// GET ALL BANNERS
export async function GET() {
  try {
    const banners = await prisma.banner.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(banners);
  } catch (error) {
    console.error("GET /api/banners failed:", error);
    return NextResponse.json(
      {
        message: "Failed to fetch banners",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
