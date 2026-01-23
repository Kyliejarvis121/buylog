"use client";

import { useState } from "react";

export default function AIChatSupport() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");

  const handleAsk = () => {
    // Simple AI-like responses before real backend
    const responses = {
      "how do i sell": "To sell, go to 'Add New Product' and fill in the details.",
      "how do i withdraw": "Withdrawals can be done from your wallet section once your balance is available.",
      "is buylog safe": "Yes! Buylog is secure and protects both buyers and sellers.",
    };

    const lowerQ = question.toLowerCase();
    const reply =
      responses[lowerQ] || "Sorry, I don't understand that question yet.";

    setAnswer(reply);
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">AI Chat Support</h1>
      <input
        type="text"
        placeholder="Ask your question..."
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        className="w-full p-2 border rounded mb-3"
      />
      <button
        onClick={handleAsk}
        className="w-full bg-green-600 text-white py-2 rounded mb-3"
      >
        Ask
      </button>

      {answer && (
        <div className="p-3 border rounded bg-gray-50 mt-2">
          <strong>AI:</strong> {answer}
        </div>
      )}
    </div>
  );
}
