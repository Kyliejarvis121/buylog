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

export default async function Page() {
  const session = await getServerSession(authOptions);

  // 1️⃣ No login → unauthorized
  if (!session) {
    return (
      <p className="p-4 text-red-600 text-center">
        Unauthorized — Please log in.
      </p>
    );
  }

  // 2️⃣ Extract user role properly
  const role = session.user.role?.toUpperCase() || "USER";

  // 3️⃣ Fetch dashboard data (admin only)
  let sales = [];
  let orders = [];
  let products = [];

  if (role === "ADMIN") {
    try {
      sales = await getData("sales");
      orders = await getData("orders");
      products = await getData("products");
    } catch (error) {
      console.log("Dashboard fetch error:", error);
    }
  }

  // 4️⃣ Return dashboard by role
  if (role === "USER") return <UserDashboard />;
  if (role === "FARMER") return <FarmerDashboard />;

  // 5️⃣ ADMIN Dashboard
  return (
    <div>
      <Heading title="Dashboard Overview" />
      <LargeCards sales={sales} />
      <SmallCards orders={orders} />
      <DashboardCharts sales={sales} />
    </div>
  );
}
