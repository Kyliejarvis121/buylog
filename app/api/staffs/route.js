import { NextResponse } from "next/server";
import { prisma } from "@/lib/prismadb";
import { hash } from "bcrypt";

export async function POST(request) {
  try {
    const { name, email, password, phone, role = "ADMIN", plan } = await request.json();

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { data: null, message: `User with email (${email}) already exists` },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await hash(password, 10);

    const newStaff = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        phone,
        role,
        plan,
        emailVerified: true, // Optional for staff
      },
    });

    return NextResponse.json({
      data: newStaff,
      message: "Staff created successfully",
    });
  } catch (error) {
    console.error("Failed to create staff:", error);
    return NextResponse.json(
      { data: null, message: "Failed to create staff", error: error.message },
      { status: 500 }
    );
  }
}
