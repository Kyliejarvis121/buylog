import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prismadb";
import nodemailer from "nodemailer";

export async function POST(req) {
  try {
    const { name, email, password } = await req.json(); // remove phone

    if (!name || !email || !password) {
      return NextResponse.json(
        { message: "Name, email, and password are required" },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json(
        { message: "Email already registered" },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationToken = Math.random().toString(36).substring(2, 15);

    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: "USER",
        emailVerified: false,
        emailVerificationToken: verificationToken,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        emailVerified: true,
        createdAt: true,
      },
    });

    // send verification email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const verificationUrl = `https://buy-log-omega.vercel.app/front-end/verify-email?token=${verificationToken}&id=${newUser.id}`;

    await transporter.sendMail({
      from: `"Buylog" <${process.env.EMAIL_USER}>`,
      to: newUser.email,
      subject: "Verify your Buylog account",
      html: `
        <p>Hi ${newUser.name},</p>
        <p>Please verify your email by clicking below:</p>
        <a href="${verificationUrl}" style="background:#22c55e;color:white;padding:10px 20px;border-radius:5px;text-decoration:none;">Verify Email</a>
      `,
    });

    return NextResponse.json(
      { message: "Registration successful. Verification email sent.", user: newUser },
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
