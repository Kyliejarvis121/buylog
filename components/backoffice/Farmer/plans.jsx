"use client";

import React, { useState } from "react";

export default function Plans({ farmerPlanId, planExpiresAt, plans }) {
  const [selectedPlan, setSelectedPlan] = useState("");

  const handleSubscribe = async () => {
    if (!selectedPlan) return alert("Select a plan!");

    try {
      const res = await fetch("/api/farmer/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId: selectedPlan }),
      });

      const data = await res.json();
      if (res.ok) alert("Plan activated successfully!");
      else alert(data.message || "Failed to activate plan");
    } catch (err) {
      alert(err.message || "Something went wrong");
    }
  };

  return (
    <div className="p-6 border rounded-lg bg-white dark:bg-gray-800">
      <h2 className="text-xl font-semibold mb-4">Your Plan</h2>
      {farmerPlanId ? (
        <p className="mb-4">Current Plan: {plans.find((p) => p.id === farmerPlanId)?.name || "Unknown"} (Expires: {new Date(planExpiresAt).toLocaleDateString()})</p>
      ) : (
        <p className="mb-4 text-sm text-gray-600">You don’t have an active plan yet.</p>
      )}

      <select className="border p-2 rounded mb-3" value={selectedPlan} onChange={(e) => setSelectedPlan(e.target.value)}>
        <option value="">Select Plan</option>
        {plans.map((plan) => (
          <option key={plan.id} value={plan.id}>
            {plan.name} - ${plan.price} ({plan.period})
          </option>
        ))}
      </select>
      <button onClick={handleSubscribe} className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
        Subscribe
      </button>
    </div>
  );
}
