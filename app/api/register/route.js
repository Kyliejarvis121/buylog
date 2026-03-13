import { NextResponse } from "next/server";
import { prisma } from "@/lib/prismadb";
import bcrypt from "bcryptjs";
import { Resend } from "resend";
import { welcomeEmailTemplate } from "@/lib/emails/welcomeEmail";

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

    // CREATE USER (no verification required)
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role,
        emailVerified: true, // treat as ready to use
      },
    });

    // CREATE FARMER PROFILE IF ROLE IS FARMER
    if (role === "FARMER") {
      await prisma.farmer.create({
        data: {
          userId: user.id,
          name: user.name,
          isActive: true,
        },
      });
    }

    // SEND WELCOME EMAIL (non-fatal)
    try {
      await resend.emails.send({
        from: "noreply@buylogint.com",
        to: email,
        subject: "Welcome to BuyLog",
        html: welcomeEmailTemplate(name),
      });
    } catch (error) {
      console.error("Welcome email failed (non-fatal):", error);
    }

    return NextResponse.json(
      { message: "Registration successful." },
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