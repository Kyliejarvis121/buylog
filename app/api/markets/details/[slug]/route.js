import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(request, { params: { slug } }) {
  try {
    const market = await prisma.market.findUnique({
      where: { slug },
    });

    if (!market) {
      return NextResponse.json(
        { data: null, message: "Market not found" },
        { status: 200 }
      );
    }

    return NextResponse.json({ data: market });
  } catch (error) {
    console.error("Failed to fetch market:", error);
    return NextResponse.json(
      {
        message: "Failed to Fetch Market",
        error: error.message || error,
      },
      { status: 500 }
    );
  }
}
