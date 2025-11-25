import { prisma } from "@/lib/prismadb";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const sales = await prisma.sale.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ data: sales, message: "Sales fetched successfully" });
  } catch (error) {
    console.error("SALES API ERROR:", error);
    return NextResponse.json({ data: null, message: "Failed to fetch sales", error: error.message }, { status: 500 });
  }
}
