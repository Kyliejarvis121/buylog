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
  try {
    const { productId, chatId, senderId, senderType, text } =
      await req.json();

    if (!senderId || !senderType || !text) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // ✅ 1️⃣ FARMER REPLY (chat already exists)
    if (chatId) {
      const message = await prisma.message.create({
        data: {
          chatId,
          text,
          senderUserId: senderType === "buyer" ? senderId : null,
          senderFarmerId: senderType === "farmer" ? senderId : null,
        },
      });

      // Update last message
      await prisma.chat.update({
        where: { id: chatId },
        data: { lastMessage: text },
      });

      await pusher.trigger(`chat-${chatId}`, "new-message", message);

      return NextResponse.json({ success: true, message });
    }

    // ✅ 2️⃣ BUYER STARTING CHAT (needs productId)
    if (!productId) {
      return NextResponse.json(
        { error: "productId required to start chat" },
        { status: 400 }
      );
    }

    // Find product + farmer
    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: { farmer: true },
    });

    if (!product || !product.farmer) {
      return NextResponse.json(
        { error: "Product or farmer not found" },
        { status: 404 }
      );
    }

    const farmerId = product.farmer.id;

    // Check if chat already exists
    let chat = await prisma.chat.findFirst({
      where: {
        productId,
        buyerId: senderType === "buyer" ? senderId : undefined,
        farmerId,
      },
    });

    // Create chat if not exists
    if (!chat) {
      chat = await prisma.chat.create({
        data: {
          productId,
          buyerId: senderType === "buyer" ? senderId : null,
          farmerId,
          lastMessage: text,
        },
      });
    } else {
      await prisma.chat.update({
        where: { id: chat.id },
        data: { lastMessage: text },
      });
    }

    // Create message
    const message = await prisma.message.create({
      data: {
        chatId: chat.id,
        text,
        senderUserId: senderType === "buyer" ? senderId : null,
        senderFarmerId: senderType === "farmer" ? senderId : null,
      },
    });

    await pusher.trigger(`chat-${chat.id}`, "new-message", message);

    return NextResponse.json({
      success: true,
      chat,
      message,
    });
  } catch (error) {
    console.error("CHAT ERROR:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
