import { prisma } from "@/lib/prismadb";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const customers = await prisma.user.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({ data: customers }, { status: 200 });
  } catch (error) {
    console.error("GET /api/users failed:", error);
    return NextResponse.json(
      {
        message: "Failed to fetch users",
        error: error?.message ?? String(error),
      },
      { status: 500 }
    );
  }
}
