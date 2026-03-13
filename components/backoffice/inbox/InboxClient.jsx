"use client";

import { useEffect, useState } from "react";
import Pusher from "pusher-js";
import ReplyBox from "./replyBox";

export default function InboxClient({ initialChats, farmerId }) {
  const [chats, setChats] = useState(initialChats);

  useEffect(() => {
    if (!chats.length) return;

    const key = process.env.NEXT_PUBLIC_PUSHER_KEY;
    const cluster = process.env.NEXT_PUBLIC_PUSHER_CLUSTER;

    if (!key || !cluster) {
      console.error("Pusher key or cluster missing");
      return;
    }

    const pusher = new Pusher(key, { cluster });

    chats.forEach((chat) => {
      const channel = pusher.subscribe(`chat-${chat.id}`);

      channel.bind("new-message", (newMessage) => {
        setChats((prevChats) =>
          prevChats.map((c) =>
            c.id === chat.id
              ? { ...c, messages: [...c.messages, newMessage] }
              : c
          )
        );
      });
    });

    return () => {
      pusher.disconnect();
    };
  }, [chats]);

  return (
    <div className="p-6 space-y-6 bg-white dark:bg-zinc-950 min-h-screen text-gray-900 dark:text-zinc-100">
      <h1 className="text-2xl font-bold">Customer Inbox</h1>

      {chats.length === 0 && (
        <p className="text-gray-500 dark:text-zinc-400">
          No messages yet.
        </p>
      )}

      {chats.map((chat) => (
        <div
          key={chat.id}
          className="border border-gray-200 dark:border-zinc-800 rounded-lg p-4 bg-white dark:bg-zinc-900 shadow-sm"
        >
          <h2 className="font-semibold text-lg">
            Product: {chat.product?.title ?? "Unknown Product"}
          </h2>

          <p className="text-sm text-gray-500 dark:text-gray-400">
            Buyer: {chat.buyer?.name ?? "Unknown Buyer"}
          </p>

          <div className="mt-3 space-y-2">
            {chat.messages.map((msg) => (
              <div
                key={msg.id}
                className={`p-2 rounded max-w-[70%] ${
                  msg.senderFarmerId
                    ? "bg-green-600 text-white ml-auto"
                    : "bg-gray-200 dark:bg-zinc-700 text-gray-900 dark:text-white"
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