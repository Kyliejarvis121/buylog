import { prisma } from "@/lib/prismadb";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const farmers = await prisma.farmer.findMany({
      orderBy: { id: "desc" }, // FIXED
      include: {
        products: true,
        user: true,
      },
    });

    return NextResponse.json({ success: true, data: farmers });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch farmers" },
      { status: 500 }
    );
  }
}
