"use client";

import { useState } from "react";
import dynamic from "next/dynamic";

const ChatBox = dynamic(() => import("./ChatBox"), { ssr: false });

export default function ProductChatSection({ product, currentUser }) {
  const [open, setOpen] = useState(false);

  if (!currentUser) {
    return (
      <div className="mt-4 p-3 bg-yellow-50 border border-yellow-300 rounded-lg text-sm">
        Please log in to chat with the seller.
      </div>
    );
  }

  return (
    <div className="mt-6">
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg shadow"
        >
          💬 Chat with Seller
        </button>
      )}

      {open && (
        <div className="mt-4">
          <ChatBox chatId={product.chatId} currentUser={currentUser} />
          <button
            onClick={() => setOpen(false)}
            className="mt-2 text-sm text-gray-500 hover:underline"
          >
            Close chat
          </button>
        </div>
      )}
    </div>
  );
}
