"use client";

import { useState } from "react";
import { MessageCircle, X } from "lucide-react";
import { useRouter } from "next/navigation";

export default function SupportWidget() {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-50 bg-emerald-600 text-white p-4 rounded-full shadow-lg hover:bg-emerald-700 transition"
      >
        <MessageCircle size={22} />
      </button>

      {/* Support Modal */}
      {open && (
        <div className="fixed bottom-20 right-6 z-50 w-72 bg-zinc-900 border border-zinc-800 rounded-xl shadow-xl">
          {/* Header */}
          <div className="flex items-center justify-between p-3 border-b border-zinc-800">
            <p className="font-semibold text-sm">Support</p>
            <button onClick={() => setOpen(false)}>
              <X size={16} />
            </button>
          </div>

          {/* Actions */}
          <div className="p-4 space-y-3">
            <button
              onClick={() => router.push("/customer-support/ai")}
              className="w-full bg-zinc-800 hover:bg-zinc-700 text-sm py-2 rounded-lg transition"
            >
              🤖 Ask AI
            </button>

            <button
              onClick={() => router.push("/customer-support/chat")}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-sm py-2 rounded-lg transition"
            >
              💬 Live Chat
            </button>
          </div>
        </div>
      )}
    </>
  );
}
