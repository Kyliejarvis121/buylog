export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function GET() {
  try {
    const sales = await db.sales.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ data: sales }, { status: 200 });
  } catch (error) {
    console.error("SALES API ERROR:", error);
    return NextResponse.json(
      { error: "Failed to load sales" },
      { status: 500 }
    );
  }
}