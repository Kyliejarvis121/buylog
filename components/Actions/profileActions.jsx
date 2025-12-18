"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prismadb";

/**
 * Update avatar only
 */
export async function updateProfileAvatar(avatarUrl) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) throw new Error("Unauthorized");

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

/**
 * Update full profile
 */
export async function updateProfile(data) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) throw new Error("Unauthorized");

  const { phone, address, country, bio } = data;

  await prisma.profile.upsert({
    where: { userId: session.user.id },
    update: {
      phone,
      address,
      country,
      bio,
    },
    create: {
      userId: session.user.id,
      phone,
      address,
      country,
      bio,
    },
  });

  return { success: true };
}
