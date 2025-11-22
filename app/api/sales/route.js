export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prismadb";

export async function GET() {
  try {
    const sales = await prisma.sales.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(
      { data: sales },
      { status: 200 }
    );
  } catch (error) {
    console.error("SALES API ERROR:", error);
    return NextResponse.json(
      { error: "Failed to load sales" },
      { status: 500 }
    );
  }
}
