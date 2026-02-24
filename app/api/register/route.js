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

    await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role,
        emailVerified: false,
      },
    });

    // SEND EMAIL
    const { data, error } = await resend.emails.send({
      from: "noreply@buylogint.com",
      to: email,
      subject: "Buylog Registration Successful 🎉",
      html: `
        <h2>Welcome ${name}!</h2>
        <p>Your account has been created successfully.</p>
        <p>You can now log in and start using Buylog.</p>
      `,
    });

    console.log("RESEND DATA:", data);
    console.log("RESEND ERROR:", error);

    if (error) {
      console.error("Resend error:", error);
      return NextResponse.json(
        { message: "Email sending failed", error },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: "Registration successful" },
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