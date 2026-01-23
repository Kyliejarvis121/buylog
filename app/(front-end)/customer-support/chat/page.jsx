"use client";

import { useState } from "react";

export default function LiveSupportChat() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [sent, setSent] = useState(false);

  const sendMessage = async () => {
    if (!form.message) return;

    await fetch("/api/support/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    setSent(true);
  };

  if (sent) {
    return (
      <div className="max-w-xl mx-auto p-6 text-center">
        <h2 className="text-xl font-bold mb-2">Message Sent</h2>
        <p className="text-gray-600">
          Our support team will respond as soon as possible.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">
        Chat with Customer Care
      </h1>

      <input
        type="text"
        placeholder="Full Name"
        className="w-full border p-2 rounded mb-3"
        onChange={(e) =>
          setForm({ ...form, name: e.target.value })
        }
      />

      <input
        type="email"
        placeholder="Email (optional)"
        className="w-full border p-2 rounded mb-3"
        onChange={(e) =>
          setForm({ ...form, email: e.target.value })
        }
      />

      <textarea
        placeholder="Type your message..."
        className="w-full border p-2 rounded mb-3"
        rows={4}
        onChange={(e) =>
          setForm({ ...form, message: e.target.value })
        }
      />

      <button
        onClick={sendMessage}
        className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
      >
        Start Chat
      </button>
    </div>
  );
}
