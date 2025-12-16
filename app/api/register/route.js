import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prismadb";
import nodemailer from "nodemailer";

export async function POST(req) {
  try {
    const { name, email, password, phone } = await req.json();

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
        phone: phone || null,
        role: "USER",
        emailVerified: false,
        emailVerificationToken: verificationToken,
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        emailVerified: true,
        createdAt: true
      }
    });

    // --------------------
    // SEND VERIFICATION EMAIL
    // --------------------
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",          // or your SMTP host
      port: 465,                       // 465 for SSL, 587 for TLS
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,  // your email
        pass: process.env.EMAIL_PASS   // your email password or app password
      }
    });

    const verificationLink = `https://yourdomain.com/verify?token=${verificationToken}&id=${newUser.id}`;

    await transporter.sendMail({
      from: `"Buylog" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Verify Your Email for Buylog",
      html: `
        <h3>Hello ${name},</h3>
        <p>Thank you for registering at Buylog.</p>
        <p>Please verify your email by clicking the link below:</p>
        <a href="${verificationLink}">Verify Email</a>
        <p>If you did not create this account, please ignore this email.</p>
      `
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
