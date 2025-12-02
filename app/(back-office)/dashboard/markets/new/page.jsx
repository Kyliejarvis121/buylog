"use client";

import React, { useEffect, useState } from "react";
import FormHeader from "@/components/backoffice/FormHeader";

export default function NewMarketPage() {
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await fetch("/api/categories");
        const data = await res.json();
        if (data.success) setCategories(data.data);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    }
    fetchCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("/api/markets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, categoryIds: selectedCategories }),
      });
      const data = await res.json();
      if (data.success) {
        setMessage("Market created successfully!");
        setName("");
        setSelectedCategories([]);
      } else {
        setMessage(data.message || "Failed to create market");
      }
    } catch (error) {
      console.error(error);
      setMessage("Error creating market");
    }

    setLoading(false);
  };

  return (
    <div className="p-6">
      <FormHeader title="New Market" />
      <form onSubmit={handleSubmit} className="space-y-4 mt-4">
        <div>
          <label className="block font-semibold">Market Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border p-2 w-full"
            required
          />
        </div>

        <div>
          <label className="block font-semibold">Select Categories</label>
          <select
            multiple
            value={selectedCategories}
            onChange={(e) =>
              setSelectedCategories(Array.from(e.target.selectedOptions, (option) => option.value))
            }
            className="border p-2 w-full"
          >
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.title}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
          disabled={loading}
        >
          {loading ? "Saving..." : "Create Market"}
        </button>
      </form>

      {message && <p className="mt-4 text-red-600">{message}</p>}
    </div>
  );
}
