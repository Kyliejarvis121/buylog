"use client";

import { useEffect, useState } from "react";

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [dashboard, setDashboard] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await fetch("/api/dashboard");
        const json = await res.json();
        setDashboard(json.data);
      } catch (err) {
        console.log("Dashboard fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) return <div>Loading dashboard...</div>;
  if (!dashboard) return <div>Failed to load dashboard</div>;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="p-5 bg-white shadow rounded-lg">
          <p className="text-lg font-semibold">Total Farmers</p>
          <h2 className="text-3xl font-bold mt-2">{dashboard.totalFarmers}</h2>
        </div>

        <div className="p-5 bg-white shadow rounded-lg">
          <p className="text-lg font-semibold">Total Sales</p>
          <h2 className="text-3xl mt-2 font-bold">{dashboard.totalSales}</h2>
        </div>

        <div className="p-5 bg-white shadow rounded-lg">
          <p className="text-lg font-semibold">Support Tickets</p>
          <h2 className="text-3xl mt-2 font-bold">{dashboard.totalSupport}</h2>
        </div>
      </div>

      {/* LATEST FARMERS */}
      <div className="mb-10">
        <h3 className="text-2xl font-semibold mb-3">Latest Farmers</h3>
        <div className="bg-white shadow rounded-lg p-5">
          {dashboard.latestFarmers.length === 0 && <p>No farmers found.</p>}
          {dashboard.latestFarmers.map((f) => (
            <div key={f.id} className="border-b py-2">
              <p className="font-medium">{f.name}</p>
              <p className="text-sm text-gray-500">{f.email}</p>
            </div>
          ))}
        </div>
      </div>

      {/* LATEST SALES */}
      <div>
        <h3 className="text-2xl font-semibold mb-3">Latest Sales</h3>
        <div className="bg-white shadow rounded-lg p-5">
          {dashboard.latestSales.length === 0 && <p>No sales yet.</p>}
          {dashboard.latestSales.map((s) => (
            <div key={s.id} className="border-b py-2">
              <p className="font-medium">₦{s.amount}</p>
              <p className="text-sm text-gray-500">
                {s.farmer?.name || "Unknown farmer"}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
