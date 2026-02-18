import { NextResponse } from "next/server";
import { prisma } from "@/lib/prismadb";
import Pusher from "pusher";

export async function POST(req) {
  try {
    const { productId, chatId, senderId, senderType, text } = await req.json();

    if (!senderId || !senderType || !text) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // 🔍 Debug
    console.log("ENV CHECK:", {
      appId: process.env.PUSHER_APP_ID,
      key: process.env.PUSHER_KEY,
      secret: process.env.PUSHER_SECRET,
      cluster: process.env.PUSHER_CLUSTER,
    });

    // ✅ Initialize Pusher
    const pusher = new Pusher({
      appId: process.env.PUSHER_APP_ID,
      key: process.env.PUSHER_KEY,
      secret: process.env.PUSHER_SECRET,
      cluster: process.env.PUSHER_CLUSTER,
      useTLS: true,
    });

    let chat;

    // Fetch existing chat
    if (chatId) {
      chat = await prisma.chat.findUnique({ where: { id: chatId } });
    }

    // If no chat exists, create a new one
    if (!chat) {
      if (!productId) return NextResponse.json({ error: "Product ID required" }, { status: 400 });

      const product = await prisma.product.findUnique({ where: { id: productId } });
      if (!product) return NextResponse.json({ error: "Product not found" }, { status: 404 });

      chat = await prisma.chat.create({
        data: {
          productId,
          buyerId: senderType === "buyer" ? senderId : null,
          farmerId: senderType === "farmer" ? senderId : product.farmerId,
          lastMessage: text,
        },
      });
    } else {
      // Update last message
      await prisma.chat.update({
        where: { id: chat.id },
        data: { lastMessage: text },
      });
    }

    // ✅ Create message using the correct Prisma fields
    const message = await prisma.message.create({
      data: {
        chatId: chat.id,
        text,
        senderUserId: senderType === "buyer" ? senderId : null,
        senderFarmerId: senderType === "farmer" ? senderId : null,
        read: false,
      },
    });

    // Trigger Pusher
    await pusher.trigger(`chat-${chat.id}`, "new-message", message);

    return NextResponse.json({ success: true, chat, message });

  } catch (error) {
    console.error("CHAT ERROR:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
