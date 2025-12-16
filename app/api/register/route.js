import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prismadb";

export async function POST(req) {
  try {
    const { name, email, password, farmName } = await req.json();

    if (!name || !email || !password || !farmName) {
      return NextResponse.json(
        { message: "All fields are required" },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: "Email already registered" },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // 1️⃣ Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: "farmer",
        emailVerified: true, // temporarily trusted
      },
    });

    // 2️⃣ Create farmer profile
    await prisma.farmer.create({
      data: {
        name: farmName,
        userId: user.id,
        isActive: true,
      },
    });

    return NextResponse.json(
      { message: "Farmer account created successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Register Error:", error);
    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}
