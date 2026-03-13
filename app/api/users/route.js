import { prisma } from "@/lib/prismadb";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      orderBy: { id: "desc" },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        password: true, // optional: include if needed for admin
        // ❌ Removed phone and emailVerified
      },
    });

    return NextResponse.json({ success: true, data: users });
  } catch (error) {
    console.error("USERS API ERROR:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to fetch users" },
      { status: 500 }
    );
  }
}
