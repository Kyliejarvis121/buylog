import { prisma } from "@/lib/prismadb";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      orderBy: { id: "desc" }, // FIXED
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        emailVerified: true,
        phone: true,
        createdAt: true, // This will still work if it exists in DB
      },
    });

    return NextResponse.json({ success: true, data: users });
  } catch (error) {
    console.error("USERS API ERROR:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch users" },
      { status: 500 }
    );
  }
}

