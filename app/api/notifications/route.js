import { NextResponse } from "next/server";
import { prisma } from "@/lib/prismadb";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

// GET notifications (for navbar & dropdown)
export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json({ notifications: [] });
  }

  const notifications = await prisma.notification.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ notifications });
}

// CREATE notification (use this from backend)
export async function POST(req) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json({ success: false, message: "Unauthorized" });
  }

  const body = await req.json();
  const { message, type } = body;

  const notification = await prisma.notification.create({
    data: {
      userId: session.user.id,
      message,
      type,
    },
  });

  return NextResponse.json({ success: true, notification });
}