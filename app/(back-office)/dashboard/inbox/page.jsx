import { prisma } from "@/lib/prismadb";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import InboxClient from "@/components/backoffice/inbox/InboxClient";

export default async function InboxPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return <div className="p-6 text-red-400">Please login to view inbox</div>;
  }

  const farmer = await prisma.farmer.findFirst({
    where: { userId: session.user.id },
  });

  if (!farmer) {
    return <div className="p-6 text-yellow-400">No farmer profile found</div>;
  }

  const chats = await prisma.chat.findMany({
    where: { farmerId: farmer.id },
    include: {
      buyer: true,
      product: true,
      messages: {
        orderBy: { createdAt: "asc" },
      },
    },
    orderBy: { updatedAt: "desc" },
  });

  return (
    <InboxClient
      initialChats={chats}
      farmerId={farmer.id}
    />
  );
}
