"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function CustomerInboxPreview() {
  const [chats, setChats] = useState([]);

  useEffect(() => {
    async function fetchChats() {
      try {
        const res = await fetch("/api/farmers/chats");
        const data = await res.json();
        if (data.success) {
          setChats(data.chats);
        }
      } catch (err) {
        console.error(err);
      }
    }

    fetchChats();
  }, []);

  if (chats.length === 0) {
    return <p className="text-zinc-400">Click to View Inbox.</p>;
  }

  return (
    <div className="space-y-3">
      {chats.slice(0, 3).map((chat) => (
        <Link
          key={chat.id}
          href={`/dashboard/inbox?chatId=${chat.id}`}
          className="block p-3 bg-zinc-800 rounded-lg hover:bg-zinc-700 transition"
        >
          <p className="font-medium">{chat.buyer?.name}</p>
          <p className="text-sm text-zinc-400 truncate">
            {chat.lastMessage || "Start conversation"}
          </p>
        </Link>
      ))}
    </div>
  );
}
