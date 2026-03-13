"use client";
import { useState } from "react";

const NewsletterForm = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (data.success || data.message) {
        setMessage(data.message || "Subscribed successfully");
        setEmail("");
      } else {
        setMessage(data.message || "Subscription failed");
      }
    } catch (error) {
      setMessage("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <p className="text-sm font-semibold tracking-widest uppercase mb-4">
        Subscribe to newsletter
      </p>

      <form onSubmit={handleSubmit} className="mt-2">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          className="w-full p-3 rounded-md border border-gray-300 focus:outline-none focus:border-blue-600"
        />

        <button
          type="submit"
          disabled={loading}
          className="mt-2 w-full py-3 bg-blue-600 rounded-md text-white font-semibold hover:bg-blue-700 transition-colors"
        >
          {loading ? "Subscribing..." : "Subscribe"}
        </button>

        {message && (
          <p className="text-sm text-green-600 mt-2">
            {message}
          </p>
        )}
      </form>
    </div>
  );
};

export default NewsletterForm;
