"use client";

import React, { useState } from "react";
import { MapPin } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

export default function LocationFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);

  const sort = searchParams.get("sort") || "asc";
  const min = searchParams.get("min") || "";
  const max = searchParams.get("max") || "";
  const page = searchParams.get("page") || 1;

  const detectLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }

    setLoading(true);

    navigator.geolocation.getCurrentPosition(async (position) => {
      const lat = position.coords.latitude;
      const lng = position.coords.longitude;

      // You can later convert this to country/state using API
      router.push(
        `?${new URLSearchParams({
          page,
          sort,
          min,
          max,
          lat,
          lng,
        })}`
      );

      setLoading(false);
    });
  };

  return (
    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-4 mb-4">
      <button
        onClick={detectLocation}
        className="flex items-center gap-2 text-sm text-lime-600 font-medium hover:underline"
      >
        <MapPin className="w-4 h-4" />
        {loading ? "Detecting location..." : "Use my location"}
      </button>
    </div>
  );
}