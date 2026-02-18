"use client";

import { useEffect, useState } from "react";
import ReplyBox from "./replyBox";

export default function InboxClient({ initialChats, farmerId }) {
  const [chats, setChats] = useState(initialChats);

  // 🔄 Auto refresh every 3 seconds (real-time feeling)
  useEffect(() => {
    const interval = setInterval(async () => {
      const res = await fetch("/api/farmer/chats");
      const data = await res.json();
      setChats(data);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

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

          <div className="mt-4">
            <ReplyBox chatId={chat.id} farmerId={farmerId} />
          </div>
        </div>
      ))}
    </div>
  );
}
