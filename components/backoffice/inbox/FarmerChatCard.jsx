"use client";

import { useEffect, useState } from "react";
import Pusher from "pusher-js";
import ReplyBox from "./replyBox";

export default function FarmerChatCard({ chat, farmerId }) {
  const [messages, setMessages] = useState(chat.messages);

  useEffect(() => {
    const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER,
    });

    const channel = pusher.subscribe(`chat-${chat.id}`);

    channel.bind("new-message", function (message) {
      setMessages((prev) => [...prev, message]);
    });

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    };
  }, [chat.id]);

  return (
    <div className="border border-zinc-800 rounded-lg p-4 bg-zinc-900">
      <h2 className="font-semibold text-lg">
        Product: {chat.product?.title ?? "Unknown Product"}
      </h2>
      <p className="text-sm text-gray-400">
        Buyer: {chat.buyer?.name ?? "Unknown Buyer"}
      </p>

      {/* Messages */}
      <div className="mt-3 space-y-2">
        {messages.map((msg) => (
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
  );
}
