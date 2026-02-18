import { prisma } from "@/lib/prismadb";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import ReplyBox from "@/components/backoffice/inbox/replyBox"; // ✅ Client component

export default async function InboxPage() {
  // 🔑 Get the logged-in session
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return <div className="p-6 text-red-400">Please login to view inbox</div>;
  }

  // 🔎 Find the farmer linked to this user
  const farmer = await prisma.farmer.findFirst({
    where: { userId: session.user.id },
  });

  if (!farmer) {
    return <div className="p-6 text-yellow-400">No farmer profile found</div>;
  }

  // 📩 Fetch chats for this farmer with messages and product/buyer info
  const chats = await prisma.chat.findMany({
    where: { farmerId: farmer.id },
    include: {
      buyer: true, // get buyer info
      product: true, // get product info
      messages: {
        orderBy: { createdAt: "asc" }, // oldest first
      },
    },
    orderBy: { updatedAt: "desc" }, // latest chat on top
  });

  return (
    <div className="p-6 space-y-6 bg-zinc-950 min-h-screen text-zinc-100">
      <h1 className="text-2xl font-bold">Customer Inbox</h1>

      {chats.length === 0 && (
        <p className="text-zinc-400">No messages yet.</p>
      )}

      {chats.map((chat) => (
        <div
          key={chat.id}
          className="border border-zinc-800 rounded-lg p-4 bg-zinc-900"
        >
          <h2 className="font-semibold text-lg">
            Product: {chat.product?.title ?? "Unknown Product"}
          </h2>
          <p className="text-sm text-gray-400">
            Buyer: {chat.buyer?.name ?? "Unknown Buyer"}
          </p>

          {/* Messages */}
          <div className="mt-3 space-y-2">
            {chat.messages.map((msg) => (
              <div
                key={msg.id}
                className={`p-2 rounded max-w-[70%] ${
                  msg.senderFarmerId
                    ? "bg-green-600 text-white ml-auto"
                    : "bg-zinc-700 text-white"
                }`}
              >
                {msg.text}
              </div>
            ))}
          </div>

          {/* Reply Box */}
          <div className="mt-4">
            <ReplyBox chatId={chat.id} farmerId={farmer.id} />
          </div>
        </div>
      ))}
    </div>
  );
}
