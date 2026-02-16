// /app/(back-office)/dashboard/inbox/page.jsx
import { prisma } from "@/lib/prismadb";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export default async function InboxPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return <div>Please login to view inbox</div>;
  }

  // Find the farmer linked to this user
  const farmer = await prisma.farmer.findFirst({
    where: { userId: session.user.id },
  });

  if (!farmer) return <div>No farmer profile found</div>;

  // Fetch chats where this farmer is seller
  const chats = await prisma.chat.findMany({
    where: { farmerId: farmer.id },
    include: {
      messages: { orderBy: { createdAt: "asc" } },
      buyer: true,
      product: true,
    },
    orderBy: { updatedAt: "desc" },
  });

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Customer Inbox</h1>
      {chats.length === 0 && <p>No messages yet</p>}
      {chats.map((chat) => (
        <div key={chat.id} className="p-4 border rounded bg-zinc-900">
          <h2 className="font-semibold">{chat.product.title}</h2>
          <p>
            Buyer: {chat.buyer.name} ({chat.buyer.email})
          </p>
          <div className="mt-2 space-y-1">
            {chat.messages.map((msg) => (
              <div
                key={msg.id}
                className={`p-2 rounded ${
                  msg.senderUserId === session.user.id
                    ? "bg-blue-600 text-white"
                    : "bg-zinc-700 text-zinc-200"
                }`}
              >
                {msg.text}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
