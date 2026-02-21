import { prisma } from "@/lib/prismadb";
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(request) {
  try {
    const { email } = await request.json();

    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { success: false, message: "Valid email is required" },
        { status: 400 }
      );
    }

    // Check if already subscribed
    const exists = await prisma.newsletterSubscriber.findUnique({
      where: { email },
    });

    if (exists) {
      return NextResponse.json({
        success: false,
        message: "You are already subscribed",
      });
    }

    // Save to database
    await prisma.newsletterSubscriber.create({
      data: { email },
    });

    // Send notification email to you
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST, // smtp.titan.email
        port: 465,
        secure: true,
        auth: {
          user: process.env.EMAIL_USER, // noreply@buylogint.com
          pass: process.env.EMAIL_PASS,
        },
      });

    await transporter.sendMail({
      from: "noreply@buylogint.com",
      to: process.env.NEWSLETTER_ADMIN_EMAIL, // your email
      subject: "New Newsletter Subscriber",
      text: `New subscriber joined: ${email}`,
    });

    return NextResponse.json({
      success: true,
      message: "Subscribed successfully",
    });
  } catch (error) {
    console.error("Newsletter error:", error);

    return NextResponse.json(
      { success: false, message: "Something went wrong" },
      { status: 500 }
    );
  }
}
