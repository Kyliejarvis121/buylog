import { NextResponse } from "next/server";
import { prisma } from "@/lib/prismadb";

export async function PUT(request) {
  try {
    const { token, id } = await request.json();

    // Validate input
    if (!id || !token) {
      return NextResponse.json(
        { data: null, message: "User ID and token are required" },
        { status: 400 }
      );
    }

    // Fetch user
    const user = await prisma.users.findUnique({ where: { id } });
    if (!user) {
      return NextResponse.json(
        { data: null, message: "No user found with this ID" },
        { status: 404 }
      );
    }

    // Update verification status
    const updatedUser = await prisma.users.update({
      where: { id },
      data: {
        emailVerified: true,
        verificationRequestCount: (user.verificationRequestCount || 0) + 1,
      },
    });

    return NextResponse.json({
      data: { id: updatedUser.id, emailVerified: updatedUser.emailVerified },
      message: "User verification updated successfully",
    });
  } catch (error) {
    console.error("PUT /api/users verification failed:", error);
    return NextResponse.json(
      { data: null, message: "Failed to update user verification", error: error.message },
      { status: 500 }
    );
  }
}
