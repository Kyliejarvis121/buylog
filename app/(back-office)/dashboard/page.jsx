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

  // Safe fetch helper
  async function safe(endpoint) {
    try {
      const res = await getData(endpoint);
      return Array.isArray(res?.data) ? res.data : [];
    } catch (e) {
      console.error("FAILED FETCH:", endpoint, e.message);
      return [];
    }
  }

  // Fetch all data concurrently
  const [sales, orders, products, farmers, supports, users] = await Promise.all([
    safe("sales"),
    safe("orders"),
    safe("products"),
    safe("farmers?includeInactive=true"),
    safe("farmerSupport"),
    safe("users"),
  ]);

  // USER dashboard
  if (role === "USER") {
    return <UserDashboard orders={orders} />;
  }

  // FARMER dashboard
  if (role === "FARMER") {
    const farmerSales = sales.filter((s) => s.farmerId === userId);
    const farmerProducts = products.filter((p) => p.farmerId === userId);
    const farmerSupport = supports.filter((s) => s.farmerId === userId);

    return (
      <FarmerDashboard
        sales={farmerSales}
        products={farmerProducts}
        supports={farmerSupport}
      />
    );
  }

  // ADMIN dashboard
  return (
    <div className="p-6">
      <Heading title="Dashboard Overview" />

      <LargeCards
        sales={sales}
        products={products}
        farmers={farmers}
      />

      <SmallCards
        orders={orders}
        supports={supports}
      />

      <DashboardCharts sales={sales} />

      <div className="mt-8">
        <Heading title="Recent Orders" />
        <CustomDataTable data={orders} type="orders" />
      </div>

      <div className="mt-8">
        <Heading title="All Farmers (Pending & Active)" />
        <CustomDataTable data={farmers} type="farmers" />
      </div>

      <div className="mt-8">
        <Heading title="All Users" />
        <CustomDataTable data={users} type="users" />
      </div>
    </div>
  );
}
