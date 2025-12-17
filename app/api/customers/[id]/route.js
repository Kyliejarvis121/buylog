import { prisma } from "@/lib/prismadb";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  const { id } = params;

  try {
    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      return NextResponse.json(
        { data: null, message: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ data: user });
  } catch (error) {
    console.error("Failed to Fetch User:", error);
    return NextResponse.json(
      { data: null, message: "Failed to fetch user", error: error.message },
      { status: 500 }
    );
  }
}
