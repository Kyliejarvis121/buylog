import { prisma } from "@/lib/prismadb";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  const { chatId } = params;

  const messages = await prisma.message.findMany({
    where: { chatId },
    orderBy: { createdAt: "asc" },
  });

  return NextResponse.json({
    success: true,
    messages,
  });
}
