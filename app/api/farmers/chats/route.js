import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prismadb";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "FARMER") {
    return Response.json({ success: false }, { status: 403 });
  }

  const chats = await prisma.chat.findMany({
    where: {
      farmerId: session.user.id,
    },
    include: {
      buyer: true,
      messages: {
        orderBy: { createdAt: "desc" },
        take: 1,
      },
    },
    orderBy: { updatedAt: "desc" },
  });

  const formattedChats = chats.map((chat) => ({
    id: chat.id,
    buyer: chat.buyer,
    lastMessage: chat.messages[0]?.content || null,
  }));

  return Response.json({
    success: true,
    chats: formattedChats,
  });
}
