import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prismadb";
import { NextResponse } from "next/server";

export async function POST(req) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { avatar } = await req.json();

  await prisma.profile.upsert({
    where: { userId: session.user.id },
    update: { avatar },
    create: {
      userId: session.user.id,
      avatar,
    },
  });

  return NextResponse.json({ success: true });
}
