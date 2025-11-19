import { prisma } from "@/lib/prismadb"; // ✅ Use Prisma singleton
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { title, link, imageUrl } = await request.json();

    const newBanner = await prisma.banners.create({
      data: {
        title,
        link,
        imageUrl,
      },
    });

    return NextResponse.json(newBanner);
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

export async function GET() {
  try {
    const banners = await prisma.banners.findMany();
    return NextResponse.json(banners);
  } catch (error) {
    console.error("GET /api/banners failed:", error);
    return NextResponse.json(
      {
        message: "Failed to fetch Banner",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
