import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prismadb";
import nodemailer from "nodemailer";

export async function POST(req) {
  try {
    const { name, email, password, farmName } = await req.json();

    // 1️⃣ Validation
    if (!name || !email || !password) {
      return NextResponse.json(
        { message: "Name, email and password are required" },
        { status: 400 }
      );
    }

    // 2️⃣ Check existing user
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: "Email already registered" },
        { status: 409 }
      );
    }

    // 3️⃣ Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4️⃣ Generate verification token
    const verificationToken = crypto.randomUUID();

    // 5️⃣ Create user + related model
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: farmName ? "FARMER" : "USER",
        emailVerified: false,
        emailVerificationToken: verificationToken,

        ...(farmName
          ? {
              farmer: {
                create: {
                  name: farmName,
                  isActive: true,
                },
              },
            }
          : {
              profile: {
                create: {}, // ✅ Proper profile creation
              },
            }),
      },
    });

    // 6️⃣ Send verification email
    const transporter = nodemailer.createTransport({
      host: "smtp.titan.email",
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const verificationUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/verify-email?token=${verificationToken}&id=${user.id}`;

    await transporter.sendMail({
      from: `"Buylog" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: "Verify your Buylog account",
      html: `
        <p>Hi ${user.name},</p>
        <p>Welcome to Buylog 👋</p>
        <p>Please verify your email to activate your account:</p>
        <a href="${verificationUrl}"
          style="display:inline-block;margin-top:10px;background:#22c55e;color:white;padding:10px 20px;border-radius:6px;text-decoration:none;">
          Verify Email
        </a>
      `,
    });

    return NextResponse.json(
      {
        message:
          "Account created successfully. Please check your email to verify your account.",
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
