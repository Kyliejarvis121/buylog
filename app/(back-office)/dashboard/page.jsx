// app/backoffice/dashboard/page.jsx

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

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  const role = session?.user?.role ?? "USER";
  const userId = session?.user?.id;

  async function safe(endpoint) {
    try {
      const res = await getData(endpoint);
      return Array.isArray(res?.data) ? res.data : [];
    } catch (e) {
      console.error("FAILED FETCH:", endpoint, e.message);
      return [];
    }
  }

  const [sales, orders, products, farmers, supports, users] = await Promise.all([
    safe("sales"),
    safe("orders"),
    safe("products"),
    safe("farmers?includeInactive=true"),
    safe("farmerSupport"),
    safe("users"),
  ]);

  if (role === "USER") {
    return (
      <div className="w-full px-4 sm:px-6 py-6">
        <UserDashboard orders={orders} />
      </div>
    );
  }

  if (role === "FARMER") {
    const farmer = farmers.find((f) => f.userId === userId);

    const farmerSales = sales.filter((s) => s.farmerId === farmer?.id);
    const farmerProducts = products.filter((p) => p.farmerId === farmer?.id);
    const farmerSupport = supports.filter((s) => s.farmerId === farmer?.id);

    return (
      <div className="w-full px-4 sm:px-6 py-6">
        <FarmerDashboard
          sales={farmerSales}
          products={farmerProducts}
          supports={farmerSupport}
        />
      </div>
    );
  }

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-6 overflow-x-hidden">

      <Heading title="Dashboard Overview" />

      <div className="mt-6">
        <LargeCards sales={sales} products={products} farmers={farmers} />
      </div>

      <div className="mt-6">
        <SmallCards orders={orders} supports={supports} />
      </div>

      <div className="mt-10">
        <DashboardCharts sales={sales} />
      </div>

      <div className="mt-10">
        <Heading title="Recent Orders" />
        <div className="mt-4 overflow-x-auto">
          <CustomDataTable data={orders} type="orders" />
        </div>
      </div>

      <div className="mt-10">
        <Heading title="All Farmers (Pending & Active)" />
        <div className="mt-4 overflow-x-auto">
          <CustomDataTable data={farmers} type="farmers" />
        </div>
      </div>

      <div className="mt-10">
        <Heading title="All Users" />
        <div className="mt-4 overflow-x-auto">
          <CustomDataTable data={users} type="users" />
        </div>
      </div>

    </div>
  );
}