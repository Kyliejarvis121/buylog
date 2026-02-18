import { NextResponse } from "next/server";
import { prisma } from "@/lib/prismadb";
import Pusher from "pusher";

export async function POST(req) {
  try {
    const { productId, chatId, senderId, senderType, text } =
      await req.json();

    if (!senderId || !senderType || !text) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const pusher = new Pusher({
      appId: process.env.PUSHER_APP_ID,
      key: process.env.PUSHER_KEY,
      secret: process.env.PUSHER_SECRET,
      cluster: process.env.PUSHER_CLUSTER,
      useTLS: true,
    });

    let chat;

    // =========================================
    // 1️⃣ IF CHAT ID PROVIDED → FIND CHAT
    // =========================================
    if (chatId) {
      chat = await prisma.chat.findUnique({
        where: { id: chatId },
      });

      if (!chat) {
        return NextResponse.json(
          { error: "Chat not found" },
          { status: 404 }
        );
      }
    }

    // =========================================
    // 2️⃣ IF NO CHAT → CREATE ONE PROPERLY
    // =========================================
    if (!chat) {
      if (!productId) {
        return NextResponse.json(
          { error: "Product ID required" },
          { status: 400 }
        );
      }

      const product = await prisma.product.findUnique({
        where: { id: productId },
      });

      if (!product) {
        return NextResponse.json(
          { error: "Product not found" },
          { status: 404 }
        );
      }

      // Only buyer can create chat first
      if (senderType !== "buyer") {
        return NextResponse.json(
          { error: "Chat must be created by buyer first" },
          { status: 400 }
        );
      }

      chat = await prisma.chat.create({
        data: {
          productId,
          buyerId: senderId,
          farmerId: product.farmerId,
          lastMessage: text,
        },
      });
    }

    // =========================================
    // 3️⃣ CREATE MESSAGE
    // =========================================
    const message = await prisma.message.create({
      data: {
        chatId: chat.id,
        text,
        senderUserId: senderType === "buyer" ? senderId : null,
        senderFarmerId: senderType === "farmer" ? senderId : null,
        read: false,
      },
    });

    // =========================================
    // 4️⃣ UPDATE LAST MESSAGE
    // =========================================
    await prisma.chat.update({
      where: { id: chat.id },
      data: { lastMessage: text },
    });

    // =========================================
    // 5️⃣ PUSHER TRIGGER
    // =========================================
    await pusher.trigger(`chat-${chat.id}`, "new-message", message);

    return NextResponse.json({
      success: true,
      chat,
      message,
    });
  } catch (error) {
    console.error("CHAT ERROR:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
