import db from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { title, link, imageUrl } = await request.json();

    const newBanner = await db.banners.create({
      data: {
        title,
        link,
        imageUrl
      },
    });

    return NextResponse.json(newBanner);
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        error: "Failed to create Banner",
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const banners = await db.banners.findMany();
    return NextResponse.json(banners);
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        message: "Failed to Fetch Banner",
        error,
      },
      { status: 500 }
    );
  }
}
