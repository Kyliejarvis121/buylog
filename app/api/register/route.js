import { NextResponse } from "next/server";
import { prisma } from "@/lib/prismadb";
import bcrypt from "bcryptjs";
import { Resend } from "resend";
import crypto from "crypto";

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

    // Generate verification token
    const verificationToken = crypto.randomUUID();

    // Create user (not verified yet)
    await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role,
        emailVerified: false, // 👈 Boolean (matches schema)
        emailVerificationToken: verificationToken,
      },
    });

    // SEND VERIFICATION EMAIL
    const { error } = await resend.emails.send({
      from: "noreply@buylogint.com",
      to: email,
      subject: "Verify Your Email Address",
      html: `
        <h2>Welcome ${name}!</h2>
        <p>Please verify your email to activate your account.</p>
        <a href="https://www.buylogint.com/api/verify-email?token=${verificationToken}">
          Verify Email
        </a>
      `,
    });

    if (error) {
      return NextResponse.json(
        { message: "Email sending failed", error },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: "Registration successful. Please verify your email." },
      { status: 201 }
    );
  } catch (err) {
    console.error("Registration error:", err);
    return NextResponse.json(
      { message: "Registration failed", error: err.message },
      { status: 500 }
    );
  }
}