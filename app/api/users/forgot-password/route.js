import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import base64url from "base64url";
import { Resend } from "resend";
import { EmailTemplate } from "@/components/email-template";
import { prisma } from "@/lib/prismadb";

export async function PUT(request) {
  const resend = new Resend(process.env.RESEND_API_KEY);

  try {
    const { email } = await request.json();

    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { data: null, message: "Valid email is required" },
        { status: 400 }
      );
    }

    // Check if user exists
    const existingUser = await prisma.users.findUnique({ where: { email } });
    if (!existingUser) {
      return NextResponse.json(
        { data: null, message: "User not found" },
        { status: 404 }
      );
    }

    // Generate token
    const rawToken = uuidv4();
    const token = base64url.encode(rawToken);

    // Optional: set token expiry (e.g., 1 hour)
    const expiryDate = new Date(Date.now() + 60 * 60 * 1000);

    // Store token in database
    await prisma.users.update({
      where: { id: existingUser.id },
      data: {
        resetToken: token,
        resetTokenExpiry: expiryDate,
      },
    });

    const redirectUrl = `reset-password?token=${token}&id=${existingUser.id}`;
    const subject = "Password Reset - Limi Ecommerce";

    await resend.emails.send({
      from: "Desishub <info@jazzafricaadventures.com>",
      to: email,
      subject,
      react: EmailTemplate({
        name: existingUser.name,
        redirectUrl,
        linkText: "Reset Password",
        description: "Click the link below to reset your password. Thank you!",
        subject,
      }),
    });

    return NextResponse.json({
      data: null,
      message: "Password reset email sent successfully",
    }, { status: 200 });
  } catch (error) {
    console.error("PUT /api/users/reset-password failed:", error);
    return NextResponse.json({
      data: null,
      message: "Server error: could not send reset email",
      error: error.message,
    }, { status: 500 });
  }
}
