export const dynamic = "force-dynamic";
export const revalidate = 0;

import React from "react";
import Heading from "@/components/backoffice/Heading";
import LargeCards from "@/components/backoffice/LargeCards";
import SmallCards from "@/components/backoffice/SmallCards";
import DashboardCharts from "@/components/backoffice/DashboardCharts";
import CustomDataTable from "@/components/backoffice/CustomDataTable";
import FarmerDashboard from "@/components/backoffice/FarmerDashboard";
import UserDashboard from "@/components/backoffice/UserDashboard";
import { getData } from "@/lib/getData";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

// Firebase imports
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import firebaseConfig from "@/lib/firebaseConfig"; // your Firebase config

// Initialize Firebase safely
let app;
let db;
try {
  app = initializeApp(firebaseConfig);
  db = getFirestore(app);
} catch (e) {
  console.error("Firebase initialization failed:", e.message || e);
}

// -------------------
// Safe fetch for REST API
// -------------------
async function safe(endpoint, timeoutMs = 5000) {
  try {
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Timeout")), timeoutMs)
    );
    const res = await Promise.race([getData(endpoint), timeoutPromise]);
    return Array.isArray(res?.data) ? res.data : [];
  } catch (e) {
    console.error("FAILED FETCH:", endpoint, e.message || e);
    return [];
  }
}

// -------------------
// Safe fetch for Firebase
// -------------------
async function safeFirebaseFetch(fetchFn, timeoutMs = 5000) {
  try {
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Timeout")), timeoutMs)
    );
    const res = await Promise.race([fetchFn(), timeoutPromise]);
    return Array.isArray(res) ? res : [];
  } catch (e) {
    console.error("Firebase fetch failed:", e.message || e);
    return [];
  }
}

export default async function DashboardPage() {
  // -------------------
  // Session
  // -------------------
  let session = null;
  try {
    session = await getServerSession(authOptions);
  } catch (e) {
    console.error("SESSION FETCH FAILED:", e.message || e);
  }

  const role = session?.user?.role ?? "USER";
  const userId = session?.user?.id ?? null;

  // -------------------
  // Fetch REST API data
  // -------------------
  const sales = await safe("sales");
  const orders = await safe("orders");
  const products = await safe("products");
  const farmers = await safe("farmers?includeInactive=true");
  const supports = await safe("farmerSupport");
  const usersFromApi = await safe("users");

  // -------------------
  // Fetch Firebase data (example: users collection)
  // -------------------
  const usersFromFirebase = db
    ? await safeFirebaseFetch(async () => {
        const snapshot = await getDocs(collection(db, "users"));
        return snapshot.docs.map((doc) => doc.data());
      })
    : [];

  // Merge API + Firebase users (optional)
  const users = [...usersFromApi, ...usersFromFirebase];

  // -------------------
  // USER DASHBOARD
  // -------------------
  if (role === "USER") {
    return (
      <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-6">
        <UserDashboard orders={orders} />
      </div>
    );
  }

  // -------------------
  // FARMER DASHBOARD
  // -------------------
  if (role === "FARMER") {
    const farmer = farmers.find((f) => f.userId === userId) || null;

    const farmerSales = sales.filter((s) => s.farmerId === farmer?.id) || [];
    const farmerProducts = products.filter((p) => p.farmerId === farmer?.id) || [];
    const farmerSupport = supports.filter((s) => s.farmerId === farmer?.id) || [];

    return (
      <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-6">
        <FarmerDashboard
          sales={farmerSales}
          products={farmerProducts}
          supports={farmerSupport}
        />
      </div>
    );
  }

  // -------------------
  // ADMIN DASHBOARD
  // -------------------
  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <Heading title="Dashboard Overview" />

      {/* Large Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
        <LargeCards sales={sales} products={products} farmers={farmers} />
      </div>

      {/* Small Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
        <SmallCards orders={orders} supports={supports} />
      </div>

      {/* Charts */}
      <div className="mt-10 w-full">
        <DashboardCharts sales={sales} />
      </div>

      {/* Recent Orders */}
      <div className="mt-10 w-full">
        <Heading title="Recent Orders" />
        <div className="mt-4 overflow-x-auto">
          <CustomDataTable data={orders} type="orders" />
        </div>
      </div>

      {/* Farmers */}
      <div className="mt-10 w-full">
        <Heading title="All Farmers (Pending & Active)" />
        <div className="mt-4 overflow-x-auto">
          <CustomDataTable data={farmers} type="farmers" />
        </div>
      </div>

      {/* Users */}
      <div className="mt-10 w-full">
        <Heading title="All Users" />
        <div className="mt-4 overflow-x-auto">
          <CustomDataTable data={users} type="users" />
        </div>
      </div>
    </div>
  );
}