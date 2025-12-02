import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prismadb"; // ✅ Use Prisma singleton

export async function PUT(request) {
  try {
    const { password, id } = await request.json();

    // Validate input
    if (!id || !password || password.length < 6) {
      return NextResponse.json(
        { data: null, message: "Invalid user ID or password (min 6 chars required)" },
        { status: 400 }
      );
    }

    // Check if user exists
    const user = await prisma.users.findUnique({ where: { id } });
    if (!user) {
      return NextResponse.json(
        { data: null, message: "No user found with this ID" },
        { status: 404 }
      );
    }

    // Encrypt the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update password
    const updatedUser = await prisma.users.update({
      where: { id },
      data: { password: hashedPassword },
    });

    return NextResponse.json({
      data: { id: updatedUser.id, email: updatedUser.email },
      message: "Password updated successfully",
    });
  } catch (error) {
    console.error("PUT /api/users failed:", error);
    return NextResponse.json(
      { data: null, message: "Failed to update user password", error: error.message },
      { status: 500 }
    );
  }
}
