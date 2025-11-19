import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { prisma } from "@/lib/prismadb"; // ✅ Use Prisma singleton
import { v4 as uuidv4 } from "uuid";
import base64url from "base64url";
import { Resend } from "resend";
// import { EmailTemplate } from "@/components/email-template";

export async function POST(request) {
  try {
    const resend = new Resend(process.env.RESEND_API_KEY);

    // Extract credentials
    const { name, email, password, role, plan } = await request.json();

    // Check if the user already exists
    const existingUser = await prisma.users.findUnique({
      where: { email },
    });
    if (existingUser) {
      return NextResponse.json(
        {
          data: null,
          message: `User with email (${email}) already exists`,
        },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate verification token
    const rawToken = uuidv4();
    const token = base64url.encode(rawToken);

    // Create user in DB
    const newUser = await prisma.users.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role,
        plan,
        verificationToken: token,
        emailVerified: false,
        verificationRequestCount: 0,
      },
    });

    console.log("New User Created:", newUser);

    // Optional: send verification email
    // if (role === "FARMER") { ... }

    return NextResponse.json(
      {
        data: newUser,
        message: "User Created Successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json(
      {
        message: "Server Error: Something went wrong",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const users = await prisma.users.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      {
        message: "Failed to fetch users",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
