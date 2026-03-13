import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prismadb";

export async function PUT(request) {
  try {
    const { id, password } = await request.json();

    // 1️⃣ Validate input
    if (!id || !password || password.length < 6) {
      return NextResponse.json(
        { message: "Invalid request or weak password (min 6 characters)" },
        { status: 400 }
      );
    }

    // 2️⃣ Check if user exists
    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    // 3️⃣ Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4️⃣ Update password + clear reset fields
    await prisma.user.update({
      where: { id },
      data: {
        password: hashedPassword,
        resetToken: null,
        resetTokenExpiry: null,
      },
    });

    return NextResponse.json(
      { message: "Password updated successfully. You can now log in." },
      { status: 200 }
    );
  } catch (error) {
    console.error("UPDATE PASSWORD ERROR:", error);
    return NextResponse.json(
      { message: "Failed to update password" },
      { status: 500 }
    );
  }
}
