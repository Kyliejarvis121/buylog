import { prisma } from "@/lib/prismadb";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const plans = await prisma.plans.findMany({ orderBy: { price: "asc" } });
    return NextResponse.json({ data: plans });
  } catch (err) {
    console.error("GET /api/plans failed:", err);
    return NextResponse.json({ message: "Failed to fetch plans", error: String(err) }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, slug, description, price, period, features = [] } = body;

    const created = await prisma.plans.create({
      data: { name, slug, description, price: parseFloat(price), period, features },
    });

    return NextResponse.json({ data: created }, { status: 201 });
  } catch (err) {
    console.error("POST /api/plans failed:", err);
    return NextResponse.json({ message: "Failed to create plan", error: String(err) }, { status: 500 });
  }
}
