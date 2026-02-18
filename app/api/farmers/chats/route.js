import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prismadb";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "FARMER") {
    return NextResponse.json(
      { success: false },
      { status: 403 }
    );
  }

  // 🔎 Find actual farmer profile
  const farmer = await prisma.farmer.findFirst({
    where: { userId: session.user.id },
  });

  if (!farmer) {
    return NextResponse.json(
      { success: false, message: "Farmer not found" },
      { status: 404 }
    );
  }

  const chats = await prisma.chat.findMany({
    where: {
      farmerId: farmer.id, // ✅ correct id now
    },
    include: {
      buyer: true,
      product: true,
      messages: {
        orderBy: { createdAt: "asc" }, // full chat
      },
    },
    orderBy: { updatedAt: "desc" },
  });

  return NextResponse.json(chats);
}
