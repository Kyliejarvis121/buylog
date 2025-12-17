import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prismadb";
import nodemailer from "nodemailer";

export async function POST(req) {
  try {
    const { name, email, password, farmName } = await req.json();

    // 1️⃣ Validate required fields
    if (!name || !email || !password || !farmName) {
      return NextResponse.json(
        { message: "All fields are required" },
        { status: 400 }
      );
    }

    // 2️⃣ Check if email already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json(
        { message: "Email already registered" },
        { status: 409 }
      );
    }

    // 3️⃣ Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4️⃣ Generate verification token
    const verificationToken = Math.random().toString(36).substring(2, 15);

    // 5️⃣ Create user (FARMER only)
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: "FARMER",
        emailVerified: false,
        emailVerificationToken: verificationToken,
      },
    });

    // 6️⃣ Create farmer profile
    await prisma.farmer.create({
      data: {
        name: farmName,
        userId: user.id,
        isActive: true,
      },
    });

    // 7️⃣ Send verification email via Titan SMTP
    const transporter = nodemailer.createTransport({
      host: "smtp.titan.email",
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // 8️⃣ Correct verification URL
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://buy-log-omega.vercel.app";
    const verificationUrl = `${baseUrl}/frontend/verify-email?token=${verificationToken}&id=${user.id}`;

    await transporter.sendMail({
      from: `"Buylog" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: "Verify your Buylog Farmer account",
      html: `
        <p>Hi ${user.name},</p>
        <p>Welcome to Buylog 👋</p>
        <p>Please verify your email to activate your farmer account:</p>
        <a href="${verificationUrl}"
          style="display:inline-block;margin-top:10px;background:#22c55e;color:white;padding:10px 20px;border-radius:6px;text-decoration:none;">
          Verify Email
        </a>
        <p style="margin-top:15px;font-size:12px;color:#555;">
          If you didn’t create this account, please ignore this email.
        </p>
      `,
    });

    // 9️⃣ Return success
    return NextResponse.json(
      {
        message:
          "Farmer account created successfully. Please check your email to verify your account.",
      },
      { status: 201 }
    );

  } catch (error) {
    console.error("REGISTER ERROR:", error);
    return NextResponse.json(
      { message: "Registration failed", error: error.message },
      { status: 500 }
    );
  }
}

