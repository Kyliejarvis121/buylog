// app/api/customers/route.js
import { prisma } from "@/lib/prismadb";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      orderBy: { name: "asc" }, // must use a valid field
    });
    return NextResponse.json({ success: true, data: users });
  } catch (error) {
    console.error("CUSTOMERS API ERROR:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch users", error: error.message },
      { status: 500 }
    );
  }
}
