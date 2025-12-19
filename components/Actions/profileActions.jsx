"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prismadb";

export async function updateAvatar(avatarUrl) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  await prisma.profile.upsert({
    where: { userId: session.user.id },
    update: { avatar: avatarUrl },
    create: {
      userId: session.user.id,
      avatar: avatarUrl,
    },
  });

  return { success: true };
}
