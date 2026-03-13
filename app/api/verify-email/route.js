export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prismadb";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get("token");
    const baseUrl = new URL(req.url).origin;

    if (!token) {
      return NextResponse.redirect(
        `${baseUrl}/verify-email?error=invalid`
      );
    }

    const user = await prisma.user.findFirst({
      where: { emailVerificationToken: token },
    });

    if (!user) {
      return NextResponse.redirect(
        `${baseUrl}/verify-email?error=expired`
      );
    }

    // ✅ Update user to verified
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerified: true,
        emailVerificationToken: null,
      },
    });

    // ✅ CREATE FARMER PROFILE IF ROLE IS FARMER
    if (updatedUser.role === "FARMER") {
      const existingFarmer = await prisma.farmer.findUnique({
        where: { userId: updatedUser.id },
      });

      if (!existingFarmer) {
        await prisma.farmer.create({
          data: {
            userId: updatedUser.id,
          },
        });
      }
    }

    return NextResponse.redirect(
      `${baseUrl}/verify-success?email=${encodeURIComponent(user.email)}`
    );
  } catch (error) {
    console.error("Verification error:", error);
    return NextResponse.redirect(
      `${new URL(req.url).origin}/verify-email?error=server`
    );
  }
}