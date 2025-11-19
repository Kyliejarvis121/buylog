import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import base64url from "base64url";
import { Resend } from "resend";
import { EmailTemplate } from "@/components/email-template";
import { prisma } from "@/lib/prismadb"; // ✅ Use Prisma singleton

export async function PUT(request) {
  const resend = new Resend(process.env.RESEND_API_KEY);

  try {
    const { email } = await request.json();

    // Check if the user already exists
    const existingUser = await prisma.users.findUnique({
      where: { email },
    });

    if (!existingUser) {
      return NextResponse.json(
        { data: null, message: "User Not Found" },
        { status: 404 }
      );
    }

    // Generate a random UUID (v4)
    const rawToken = uuidv4();
    const token = base64url.encode(rawToken);

    const userId = existingUser.id;
    const name = existingUser.name;
    const redirectUrl = `reset-password?token=${token}&id=${userId}`;
    const linkText = "Reset Password";
    const description =
      "Click on the following link in order to reset your password. Thank you";
    const subject = "Password Reset - Limi Ecommerce";

    console.log(userId, name, redirectUrl);

    await resend.emails.send({
      from: "Desishub <info@jazzafricaadventures.com>",
      to: email,
      subject,
      react: EmailTemplate({
        name,
        redirectUrl,
        linkText,
        description,
        subject,
      }),
    });

    console.log("Token:", token);

    return NextResponse.json(
      { data: null, message: "User Updated Successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Server Error:", error);
    return NextResponse.json(
      { error: error.message, message: "Server Error: Something went wrong" },
      { status: 500 }
    );
  }
}
