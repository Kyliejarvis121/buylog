import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import base64url from "base64url";
import { Resend } from "resend";
import { prisma } from "@/lib/prismadb";

export async function PUT(request) {
  const resend = new Resend(process.env.RESEND_API_KEY);

  try {
    const { email } = await request.json();

    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { message: "Valid email is required" },
        { status: 400 }
      );
    }

    // ✅ CORRECT MODEL NAME
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json(
        { message: "Account not found" },
        { status: 404 }
      );
    }

    // Generate token
    const token = base64url.encode(uuidv4());
    const expiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetToken: token,
        resetTokenExpiry: expiry,
      },
    });

    const resetUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/reset-password?token=${token}&id=${user.id}`;

    await resend.emails.send({
      from: "Buylog <info@buylog.com>",
      to: email,
      subject: "Reset your password",
      html: `
        <p>Hello ${user.name},</p>
        <p>You requested to reset your password.</p>
        <p>This link expires in 1 hour.</p>
        <a href="${resetUrl}"
           style="display:inline-block;margin-top:10px;
                  background:#22c55e;color:white;
                  padding:10px 18px;border-radius:6px;
                  text-decoration:none;">
          Reset Password
        </a>
      `,
    });

    return NextResponse.json(
      { message: "Password reset email sent" },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ FORGOT PASSWORD ERROR:", error);
    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}
