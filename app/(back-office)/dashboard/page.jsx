export const dynamic = "force-dynamic";
export const revalidate = 0;

import Heading from "@/components/backoffice/Heading";
import LargeCards from "@/components/backoffice/LargeCards";
import SmallCards from "@/components/backoffice/SmallCards";
import DashboardCharts from "@/components/backoffice/DashboardCharts";
import FarmerDashboard from "@/components/backoffice/FarmerDashboard";
import UserDashboard from "@/components/backoffice/UserDashboard";

import { authOptions } from "@/lib/authOptions";
import { getData } from "@/lib/getData";
import { getServerSession } from "next-auth";

export default async function Page() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return (
      <p className="p-4 text-red-600 text-center">
        Unauthorized — Please log in.
      </p>
    );
  }

  const role = session.user.role?.toUpperCase() || "USER";

  // Data placeholders
  let sales = [];
  let orders = [];
  let products = [];

  // Admin data fetch
  if (role === "ADMIN") {
    try {
      sales = (await getData("sales")) || [];
      orders = (await getData("orders")) || [];
      products = (await getData("products")) || [];
    } catch (error) {
      console.error("Dashboard fetch error:", error);
    }
  }

  // Render dashboards by role
  if (role === "USER") return <UserDashboard />;
  if (role === "FARMER") return <FarmerDashboard />;

  // Admin Dashboard fallback
  return (
    <div className="space-y-6 p-4">
      <Heading title="Dashboard Overview" />

      {/* Large Cards */}
      {LargeCards ? <LargeCards sales={sales} /> : <p>LargeCards component missing</p>}

      {/* Small Cards */}
      {SmallCards ? <SmallCards orders={orders} /> : <p>SmallCards component missing</p>}

      {/* Dashboard Charts */}
      {DashboardCharts ? <DashboardCharts sales={sales} /> : <p>DashboardCharts component missing</p>}

      {/* Optional sections - placeholders */}
      <section className="mt-6">
        <h2 className="text-lg font-semibold">Farmer Support</h2>
        <p>Coming soon...</p>
      </section>

      <section className="mt-6">
        <h2 className="text-lg font-semibold">Settings</h2>
        <p>Coming soon...</p>
      </section>
    </div>
  );
}
