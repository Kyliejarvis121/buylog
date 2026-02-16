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
  const { productId, senderId, senderType, text } = await req.json();

  // Validate input
  if (!productId || !senderId || !senderType || !text) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  // 1️⃣ Find the product and the farmer
  const product = await prisma.product.findUnique({
    where: { id: productId },
    include: { farmer: true },
  });

  if (!product || !product.farmer) {
    return NextResponse.json({ error: "Product or farmer not found" }, { status: 404 });
  }

  const farmerId = product.farmer.id;

  // 2️⃣ Check if chat exists
  let chat = await prisma.chat.findFirst({
    where: { productId, buyerId: senderType === "buyer" ? senderId : undefined, farmerId },
  });

  // 3️⃣ Create chat if it doesn’t exist
  if (!chat) {
    chat = await prisma.chat.create({
      data: {
        productId,
        buyerId: senderType === "buyer" ? senderId : undefined,
        farmerId,
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

  // 4️⃣ Create the message
  const messageData = {
    chatId: chat.id,
    text,
    senderUserId: senderType === "buyer" ? senderId : null,
    senderFarmerId: senderType === "farmer" ? senderId : null,
  };

  const message = await prisma.message.create({ data: messageData });

  // 5️⃣ Trigger Pusher event
  await pusher.trigger(`chat-${chat.id}`, "new-message", message);

  return NextResponse.json({ success: true, chat, message });
}
