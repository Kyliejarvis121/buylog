import { NextResponse } from "next/server";
import { prisma } from "@/lib/prismadb";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get("token");

  if (!token) {
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_BASE_URL}/verify-email?error=invalid`
    );
  }

  const user = await prisma.user.findFirst({
    where: { verificationToken: token },
  });

  if (!user) {
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_BASE_URL}/verify-email?error=expired`
    );
  }

  await prisma.user.update({
    where: { id: user.id },
    data: {
      emailVerified: true,
      verificationToken: null,
    },
  });

  // ✅ Redirect to verify-success page
  return NextResponse.redirect(
    `${process.env.NEXT_PUBLIC_BASE_URL}/verify-success?email=${encodeURIComponent(
      user.email
    )}`
  );
}
