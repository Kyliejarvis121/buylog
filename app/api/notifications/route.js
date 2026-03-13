import { NextResponse } from "next/server";
import { prisma } from "@/lib/prismadb";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

// =====================================
// GET notifications
// =====================================
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

// =====================================
// CREATE notification (backend use)
// =====================================
export async function POST(req) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json({ success: false, message: "Unauthorized" });
  }

  const body = await req.json();
  const { message, type, chatId } = body;

  const notification = await prisma.notification.create({
    data: {
      userId: session.user.id,
      chatId: chatId || null,  // 👈 store chatId
      message,
      type,
    },
  });

  return NextResponse.json({ success: true, notification });
}