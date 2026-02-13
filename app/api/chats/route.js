import { NextResponse } from "next/server";
import Pusher from "pusher";
import { prisma } from "@/lib/prismadb";

const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID,
  key: process.env.PUSHER_KEY,
  secret: process.env.PUSHER_SECRET,
  cluster: process.env.PUSHER_CLUSTER,
  useTLS: true,
});

export async function POST(req) {
  const { chatId, senderId, text } = await req.json();

  // Create message in DB
  const message = await prisma.message.create({
    data: {
      chatId,
      senderId,
      text,
    },
  });

  // Trigger Pusher event
  await pusher.trigger(`chat-${chatId}`, "new-message", message);

  return NextResponse.json({ success: true, message });
}
