import { prisma } from "@/lib/prismadb";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const trainings = await prisma.training.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ data: trainings, message: "Trainings fetched successfully" });
  } catch (error) {
    console.error("GET /api/trainings failed:", error);
    return NextResponse.json({ data: null, message: "Failed to fetch trainings", error: error.message }, { status: 500 });
  }
}
