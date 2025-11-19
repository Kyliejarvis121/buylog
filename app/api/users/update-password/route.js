import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { prisma } from "@/lib/prismadb"; // ✅ Use Prisma singleton

export async function PUT(request) {
  try {
    const { password, id } = await request.json();

    const user = await prisma.users.findUnique({
      where: { id },
    });

    if (!user) {
      return NextResponse.json(
        { data: null, message: "No User Found" },
        { status: 404 }
      );
    }

    // Encrypt the password
    const hashedPassword = await bcrypt.hash(password, 10);

    const updatedUser = await prisma.users.update({
      where: { id },
      data: { password: hashedPassword },
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
