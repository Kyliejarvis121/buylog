import { prisma } from "@/lib/prismadb";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function POST(req) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({});
  }

  const { status } = await req.json();

  await prisma.farmer.update({
    where: { userId: session.user.id },
    data: {
      isActive: status === "online",
      lastSeen: new Date(),
    },
  });

  return NextResponse.json({ success: true });
}