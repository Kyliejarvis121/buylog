import { NextResponse } from "next/server";
import { prisma } from "@/lib/prismadb";
import bcrypt from "bcryptjs";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req) {
  try {
    const body = await req.json();
    const { email, password, name, role } = body;

    if (!email || !password || !name) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: "Email already exists" },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role,
        emailVerified: false,
      },
    });

    // ✅ SEND EMAIL HERE
    const { error } = await resend.emails.send({
      from: "onboarding@resend.dev", // use this first
      to: email,
      subject: "Welcome to Buylog 🎉",
      html: `
        <h2>Welcome ${name}!</h2>
        <p>Your account has been created successfully.</p>
        <p>You can now login and start using Buylog.</p>
      `,
    });

    if (error) {
      console.error("Resend error:", error);
    }

    return NextResponse.json(
      { message: "Registration successful" },
      { status: 201 }
    );
  } catch (err) {
    console.error("Registration error:", err);
    return NextResponse.json(
      { message: "Registration failed" },
      { status: 500 }
    );
  }
}