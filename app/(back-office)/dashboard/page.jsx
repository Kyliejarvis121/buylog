export const dynamic = "force-dynamic";
export const revalidate = 0;

import CustomDataTable from "@/components/backoffice/CustomDataTable";
import DashboardCharts from "@/components/backoffice/DashboardCharts";
import FarmerDashboard from "@/components/backoffice/FarmerDashboard";
import Heading from "@/components/backoffice/Heading";
import LargeCards from "@/components/backoffice/LargeCards";
import SmallCards from "@/components/backoffice/SmallCards";
import UserDashboard from "@/components/backoffice/UserDashboard";
import { authOptions } from "@/lib/authOptions";
import { getData } from "@/lib/getData";
import { getServerSession } from "next-auth";
import React from "react";

export default async function page() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return <p className="p-4 text-red-600">Unauthorized</p>;
  }

  const role =
    session.user.role || (session.user.isAdmin ? "ADMIN" : "USER");

  const sales = await getData("sales");
  const orders = await getData("orders");
  const products = await getData("products");

  if (role === "USER") return <UserDashboard />;
  if (role === "FARMER") return <FarmerDashboard />;

  // Default: Admin
  return (
    <div>
      <Heading title="Dashboard Overview" />
      <LargeCards sales={sales} />
      <SmallCards orders={orders} />
      <DashboardCharts sales={sales} />
      {/* <CustomDataTable /> */}
    </div>
  );
}
