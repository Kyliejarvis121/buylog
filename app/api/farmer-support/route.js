import { prisma } from "@/lib/prismadb";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const supportTickets = await prisma.farmerSupport.findMany({
      orderBy: { createdAt: "desc" },
      include: { farmer: true },
    });

    return NextResponse.json({
      data: supportTickets,
      message: "Farmer support tickets fetched successfully",
    });
  } catch (error) {
    console.error("GET /api/farmerSupport failed:", error);
    return NextResponse.json(
      { data: null, message: "Failed to fetch farmer support tickets", error: error.message },
      { status: 500 }
    );
  }
}
