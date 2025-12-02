import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        emailVerified: true,
        phone: true,
        createdAt: true,
      },
    });

    return NextResponse.json({
      success: true,
      data: users, // MUST be an array
    });
  } catch (error) {
    console.error("USERS API ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        data: [],
        message: "Failed to fetch users",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
