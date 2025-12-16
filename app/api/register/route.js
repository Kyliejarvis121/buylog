import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prismadb";
import nodemailer from "nodemailer";

export async function POST(req) {
  try {
    const { name, email, password, farmName } = await req.json();

    // ✅ Validate required fields
    if (!name || !email || !password || !farmName) {
      return NextResponse.json(
        { message: "All fields are required" },
        { status: 400 }
      );
    }

    // ✅ Check if email already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json(
        { message: "Email already registered" },
        { status: 409 }
      );
    }

    // ✅ Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ Generate email verification token
    const verificationToken = Math.random().toString(36).substring(2, 15);

    // 1️⃣ Create user with role FARMER
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: "FARMER",       // force role as FARMER
        emailVerified: false, // email not verified yet
        emailVerificationToken: verificationToken,
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

    // 3️⃣ Send verification email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const verificationUrl = `https://buy-log-omega.vercel.app/front-end/verify-email?token=${verificationToken}&id=${user.id}`;

    await transporter.sendMail({
      from: `"Buylog" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: "Verify your Farmer account",
      html: `
        <p>Hi ${user.name},</p>
        <p>Please verify your email by clicking below:</p>
        <a href="${verificationUrl}" style="background:#22c55e;color:white;padding:10px 20px;border-radius:5px;text-decoration:none;">Verify Email</a>
      `,
    });

    return NextResponse.json(
      { message: "Farmer account created successfully. Verification email sent." },
      { status: 201 }
    );

  } catch (error) {
    console.error("Register Error:", error);
    return NextResponse.json(
      { message: "Server error", error: error.message },
      { status: 500 }
    );
  }
}
