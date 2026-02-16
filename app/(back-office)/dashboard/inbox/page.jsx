import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prismadb";
import dynamic from "next/dynamic";

const ChatBox = dynamic(
  () => import("@/components/frontend/chat/ChatBox"),
  { ssr: false }
);

export default async function InboxPage({ searchParams }) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "FARMER") {
    return (
      <div className="p-6 text-red-500">
        Access denied. Farmers only.
      </div>
    );
  }

  const chats = await prisma.chat.findMany({
    where: {
      farmerId: session.user.id,
    },
    include: {
      buyer: true,
      product: true,
      messages: {
        orderBy: { createdAt: "asc" },
      },
    },
    orderBy: {
      updatedAt: "desc",
    },
  });

  const selectedChatId = searchParams?.chatId || chats[0]?.id;
  const selectedChat = chats.find((c) => c.id === selectedChatId);

  return (
    <div className="p-6 bg-zinc-950 min-h-screen text-zinc-100">
      <h1 className="text-2xl font-bold mb-6">Customer Inbox</h1>

      <div className="grid md:grid-cols-3 gap-6">
        {/* LEFT SIDE — CHAT LIST */}
        <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-4 space-y-3">
          {chats.length === 0 ? (
            <p className="text-zinc-400">No conversations yet.</p>
          ) : (
            chats.map((chat) => (
              <a
                key={chat.id}
                href={`/dashboard/inbox?chatId=${chat.id}`}
                className={`block p-3 rounded-lg transition ${
                  selectedChatId === chat.id
                    ? "bg-zinc-700"
                    : "bg-zinc-800 hover:bg-zinc-700"
                }`}
              >
                <p className="font-medium">
                  {chat.buyer?.name || "Buyer"}
                </p>
                <p className="text-xs text-zinc-400">
                  Product: {chat.product?.title}
                </p>
              </a>
            ))
          )}
        </div>

        {/* RIGHT SIDE — CHAT WINDOW */}
        <div className="md:col-span-2 bg-zinc-900 rounded-xl border border-zinc-800 p-4">
          {selectedChat ? (
            <ChatBox
              chat={selectedChat}
              currentUser={session.user}
            />
          ) : (
            <p className="text-zinc-400">
              Select a conversation to start chatting.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
