import { prisma } from "@/lib/prismadb"; // <-- FIXED
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  try {
    const { slug } = params;

    const market = await prisma.market.findUnique({
      where: { slug },
      include: {
        categories: true,
        products: true,
      },
    });

    if (!market) {
      return NextResponse.json(
        { message: "Market not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ data: market });
  } catch (err) {
    return NextResponse.json(
      { message: err.message },
      { status: 500 }
    );
  }
}
