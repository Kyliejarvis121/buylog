import { prisma } from "@/lib/prismadb";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import ReplyBox from "@/components/backoffice/chat/ReplyBox"; // ✅ ADD THIS

export default async function InboxPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return <div className="p-6">Please login</div>;
  }

  // 🔎 Find farmer linked to user
  const farmer = await prisma.farmer.findFirst({
    where: { userId: session.user.id },
  });

  if (!farmer) {
    return <div className="p-6">No farmer profile found</div>;
  }

  // 📩 Get chats
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
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Customer Inbox</h1>

      {chats.length === 0 && <p>No messages yet.</p>}

      {chats.map((chat) => (
        <div key={chat.id} className="border p-4 rounded-lg bg-zinc-900">
          <h2 className="font-semibold text-lg">
            Product: {chat.product.title}
          </h2>

          <p className="text-sm text-gray-400">
            Buyer: {chat.buyer.name}
          </p>

          <div className="mt-3 space-y-2">
            {chat.messages.map((msg) => (
              <div
                key={msg.id}
                className={`p-2 rounded ${
                  msg.senderFarmerId
                    ? "bg-green-600 text-white ml-auto w-fit"
                    : "bg-zinc-700 text-white w-fit"
                }`}
              >
                {msg.text}
              </div>
            ))}
          </div>

          {/* Reply form */}
          <ReplyBox chatId={chat.id} farmerId={farmer.id} />
        </div>
      ))}
    </div>
  );
}
