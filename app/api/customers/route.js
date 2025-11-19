import { prisma } from "@/lib/prismadb";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Fetch all users
    const customers = await prisma.users.findMany({
      orderBy: {
        date: "desc", // 'date' exists in your schema, 'createdAt' does not
      },
      // Remove role filter if it doesn't exist
      // where: { role: "USER" }, 
    });

    return NextResponse.json(customers);
  } catch (error) {
    console.error("GET /api/users failed:", error);
    return NextResponse.json(
      {
        message: "Failed to fetch users",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

