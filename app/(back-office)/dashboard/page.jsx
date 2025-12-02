// app/backoffice/dashboard/page.jsx
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

  // Default to USER role if session missing
  const role = session?.user?.role ?? "USER";
  const userId = session?.user?.id;

  // Safe fetch helper
  async function safe(endpoint) {
    try {
      const res = await getData(endpoint);
      // unwrap 'data' property; fallback to empty array
      return res?.data ?? [];
    } catch (e) {
      console.error("FAILED:", endpoint, e.message);
      return [];
    }
  }

  // Fetch all needed data concurrently
  const [sales, orders, products, farmers, supports, users] = await Promise.all([
    safe("sales"),
    safe("orders"),
    safe("products"),
    safe("farmers?includeInactive=true"),
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
        sales={Array.isArray(sales) ? sales.filter((s) => s.vendorId === userId) : []}
        products={Array.isArray(products) ? products.filter((p) => p.farmerId === userId) : []}
        support={Array.isArray(supports) ? supports.filter((s) => s.farmerId === userId) : []}
      />
    );
  }

  // ADMIN DASHBOARD
  return (
    <div className="p-6">
      <Heading title="Dashboard Overview" />

      <LargeCards
        sales={Array.isArray(sales) ? sales : []}
        products={Array.isArray(products) ? products : []}
        farmers={Array.isArray(farmers) ? farmers : []}
      />

      <SmallCards
        orders={Array.isArray(orders) ? orders : []}
        supports={Array.isArray(supports) ? supports : []}
      />

      <DashboardCharts
        sales={Array.isArray(sales) ? sales : []}
      />

      <div className="mt-8">
        <Heading title="Recent Orders" />
        <CustomDataTable data={Array.isArray(orders) ? orders : []} type="orders" />
      </div>

      <div className="mt-8">
        <Heading title="All Farmers (Pending & Active)" />
        <CustomDataTable data={Array.isArray(farmers) ? farmers : []} type="farmers" />
      </div>

      <div className="mt-8">
        <Heading title="All Users" />
        <CustomDataTable data={Array.isArray(users) ? users : []} type="users" />
      </div>
    </div>
  );
}

