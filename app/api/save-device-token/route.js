import { prisma } from "@/lib/prismadb";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

export async function POST(req) {
  const session = await getServerSession(authOptions);
  const { token } = await req.json();

  await prisma.user.update({
    where: { id: session.user.id },
    data: { deviceToken: token },
  });

  return Response.json({ success: true });
}