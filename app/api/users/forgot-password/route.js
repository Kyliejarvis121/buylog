import { NextResponse } from "next/server";
import crypto from "crypto";
import { Resend } from "resend";
import { prisma } from "@/lib/prismadb";

export async function PUT(request) {
  try {
    const { email } = await request.json();

    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { message: "Valid email is required" },
        { status: 400 }
      );
    }

    // ✅ FIXED: prisma.user (NOT users)
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json(
        { message: "No account found with this email" },
        { status: 404 }
      );
    }

    // Generate secure token
    const token = crypto.randomBytes(32).toString("hex");
    const expiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    // Save token on USER (works for FARMER & USER)
    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetToken: token,
        resetTokenExpiry: expiry,
      },
    });

    const resetUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/reset-password?token=${token}&id=${user.id}`;

    const resend = new Resend(process.env.RESEND_API_KEY);

    await resend.emails.send({
      from: "Buylog <onboarding@resend.dev>", // ✅ SAFE DEFAULT
      to: email,
      subject: "Reset your Buylog password",
      html: `
        <h2>Hello ${user.name}</h2>
        <p>You requested to reset your password.</p>
        <p>This link expires in 1 hour.</p>
        <a href="${resetUrl}"
          style="display:inline-block;padding:12px 20px;background:#7c3aed;color:white;border-radius:6px;text-decoration:none;">
          Reset Password
        </a>
      `,
    });

    return NextResponse.json(
      { message: "Password reset email sent successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("FORGOT PASSWORD ERROR:", error);

    return NextResponse.json(
      { message: "Failed to send reset email" },
      { status: 500 }
    );
  }
}
