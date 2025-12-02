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

  // Helper to safely fetch data
  async function safe(endpoint) {
    try {
      const res = await getData(endpoint);
      return res || []; // ensure array fallback
    } catch (e) {
      console.error(`FAILED: ${endpoint}`, e.message);
      return [];
    }
  }

  // Fetch all needed data concurrently
  const [sales, orders, products, farmers, supports, users] = await Promise.all([
    safe("sales"),
    safe("orders"),
    safe("products"),
    safe("farmers?includeInactive=true"), // Admin sees all
    safe("farmerSupport"),
    safe("users"),
  ]);

  // USER DASHBOARD
  if (role === "USER") {
    return <UserDashboard orders={orders} />;
  }

  // FARMER DASHBOARD
  if (role === "FARMER") {
    return (
      <FarmerDashboard
        sales={sales.filter((s) => s.vendorId === userId)}
        products={products.filter((p) => p.farmerId === userId)}
        support={supports.filter((s) => s.farmerId === userId)}
      />
    );
  }

  // ADMIN DASHBOARD
  return (
    <div className="p-6">
      <Heading title="Dashboard Overview" />

      <LargeCards sales={sales} products={products} farmers={farmers} />
      <SmallCards orders={orders} supports={supports} />
      <DashboardCharts sales={sales} />

      {/* Recent Orders */}
      <div className="mt-8">
        <Heading title="Recent Orders" />
        <CustomDataTable data={orders} type="orders" />
      </div>

      {/* All Farmers */}
      <div className="mt-8">
        <Heading title="All Farmers (Pending & Active)" />
        <CustomDataTable data={farmers} type="farmers" />
      </div>

      {/* All Users */}
      <div className="mt-8">
        <Heading title="All Users" />
        <CustomDataTable data={users} type="users" />
      </div>
    </div>
  );
}
