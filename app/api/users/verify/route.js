import { NextResponse } from "next/server";
import { prisma } from "@/lib/prismadb";

export async function PUT(request) {
  try {
    const { token, id } = await request.json();

    if (!id || !token) {
      return NextResponse.json(
        { data: null, message: "User ID and token are required" },
        { status: 400 }
      );
    }

    // Fetch user by id
    const user = await prisma.users.findUnique({ where: { id } });
    if (!user) {
      return NextResponse.json(
        { data: null, message: "No user found with this ID" },
        { status: 404 }
      );
    }

    // Check if token matches
    if (user.emailVerificationToken !== token) {
      return NextResponse.json(
        { data: null, message: "Invalid verification token" },
        { status: 401 }
      );
    }

    // Update verification status
    const updatedUser = await prisma.users.update({
      where: { id },
      data: {
        emailVerified: true,
        verificationRequestCount: (user.verificationRequestCount || 0) + 1,
        emailVerificationToken: null, // clear token after use
      },
    });

    return NextResponse.json({
      data: { id: updatedUser.id, emailVerified: updatedUser.emailVerified },
      message: "User verified successfully",
    });
  } catch (error) {
    console.error("PUT /api/users verification failed:", error);
    return NextResponse.json(
      { data: null, message: "Failed to verify user", error: error.message },
      { status: 500 }
    );
  }
}
