import { NextResponse } from "next/server";
import { prisma } from "@/lib/prismadb";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

export async function POST(req) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { productId, sellerId } = await req.json();

  // Check if chat already exists
  const existingChat = await prisma.chat.findFirst({
    where: {
      productId,
      buyerId: session.user.id,
      sellerId,
    },
  });

  if (existingChat) {
    return NextResponse.json({ chatId: existingChat.id });
  }

  // Create new chat
  const chat = await prisma.chat.create({
    data: {
      productId,
      buyerId: session.user.id,
      sellerId,
    },
  });

  return NextResponse.json({ chatId: chat.id });
}
