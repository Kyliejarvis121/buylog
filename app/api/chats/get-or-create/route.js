import { NextResponse } from "next/server";
import { prisma } from "@/lib/prismadb";

export async function POST(req) {
  const { productId, buyerId, sellerId } = await req.json();

  if (!productId || !buyerId || !sellerId) {
    return NextResponse.json({ success: false, message: "Missing required fields" });
  }

  try {
    // 1️⃣ Try to find existing chat
    let chat = await prisma.chat.findFirst({
      where: {
        productId,
        buyerId,
        sellerId,
      },
      include: {
        messages: true,
      },
    });

    // 2️⃣ Create if not found
    if (!chat) {
      chat = await prisma.chat.create({
        data: {
          productId,
          buyerId,
          sellerId,
        },
      });
    }

    return NextResponse.json({ success: true, chat });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false, message: "Server error" });
  }
}
