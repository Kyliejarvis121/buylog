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
  const role = session?.user?.role;

  // Fetch all necessary dashboard data
  const [salesRes, ordersRes, productsRes, farmersRes, supportsRes] =
    await Promise.all([
      getData("sales"),
      getData("orders"),
      getData("products"),
      getData("farmers?includeInactive=true"), // include inactive farmers
      getData("farmerSupport"),
    ]);

  const sales = salesRes?.data || [];
  const orders = ordersRes?.data || [];
  const products = productsRes?.data || [];
  const farmers = farmersRes?.data || [];
  const supports = supportsRes?.data || [];

  // Render role-specific dashboards
  if (role === "USER") return <UserDashboard orders={orders} />;
  if (role === "FARMER")
    return <FarmerDashboard sales={sales} products={products} support={supports} />;

  // Admin dashboard
  return (
    <div className="p-6">
      <Heading title="Dashboard Overview" />

      {/* Large Cards */}
      <LargeCards sales={sales} products={products} farmers={farmers} />

      {/* Small Cards */}
      <SmallCards orders={orders} supports={supports} />

      {/* Charts */}
      <DashboardCharts sales={sales} />

      {/* Recent Orders Table */}
      <CustomDataTable orders={orders} />

      {/* Optionally: Show farmers table */}
      <div className="mt-8">
        <Heading title="All Farmers (Pending & Active)" />
        <CustomDataTable
          data={farmers}
          columns={[
            { header: "Name", accessor: "name" },
            { header: "Email", accessor: "email" },
            { header: "Phone", accessor: "phone" },
            { header: "Active", accessor: "isActive", cell: (row) => (row.isActive ? "Yes" : "No") },
            { header: "Created At", accessor: "createdAt" },
          ]}
        />
      </div>
    </div>
  );
}
