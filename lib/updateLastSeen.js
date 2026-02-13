import { prisma } from "./prismadb";

export async function updateLastSeen(userId) {
  if (!userId) return;
  await prisma.user.update({
    where: { id: userId },
    data: { lastSeen: new Date() },
  });
}