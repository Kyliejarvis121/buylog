import { NextResponse } from "next/server";
import { prisma } from "@/lib/prismadb"; // ✅ Use Prisma singleton

export async function PUT(request) {
  try {
    const { token, id } = await request.json();

    const user = await prisma.users.findUnique({
      where: { id },
    });

    if (!user) {
      return NextResponse.json(
        { data: null, message: "No User Found" },
        { status: 404 }
      );
    }

    const updatedUser = await prisma.users.update({
      where: { id },
      data: {
        emailVerified: true,
        verificationRequestCount: (user.verificationRequestCount || 0) + 1,
      },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("Failed to Update User:", error);
    return NextResponse.json(
      { message: "Failed to Update User", error: error.message },
      { status: 500 }
    );
  }
}
