import { prisma } from "@/lib/prismadb";
import { NextResponse } from "next/server";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const productId = searchParams.get("productId");
  const buyerId = searchParams.get("buyerId");

  if (!productId || !buyerId) {
    return NextResponse.json({ success: false });
  }

  const chat = await prisma.chat.findFirst({
    where: {
      productId,
      buyerId,
    },
    include: {
      messages: {
        orderBy: { createdAt: "asc" },
      },
    },
  });

  return NextResponse.json({
    success: true,
    chat,
  });
}
