import { prisma } from "@/lib/prismadb";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const supports = await prisma.farmerSupport.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ success: true, data: supports });
  } catch (error) {
    console.error("FARMER SUPPORT ERROR:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch farmer support" },
      { status: 500 }
    );
  }
}
