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

  // ----------------------------
  // Fetch data safely
  // ----------------------------
  const fetchData = async (endpoint) => {
    try {
      const res = await getData(endpoint);
      return res?.data || [];
    } catch (err) {
      console.error(`Failed to fetch ${endpoint}:`, err.message);
      return [];
    }
  };

  const [sales, orders, products, farmers, supports, users] = await Promise.all([
    fetchData("sales"),
    fetchData("orders"),
    fetchData("products"),
    fetchData("farmers?includeInactive=true"), // fetch all farmers
    fetchData("farmerSupport"),
    fetchData("users"), // fetch all users for admin
  ]);

  // ----------------------------
  // Role-specific dashboards
  // ----------------------------
  if (role === "USER") return <UserDashboard orders={orders} />;
  if (role === "FARMER")
    return <FarmerDashboard sales={sales} products={products} support={supports} />;

  // ----------------------------
  // Admin dashboard
  // ----------------------------
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
      <div className="mt-8">
        <Heading title="Recent Orders" />
        <CustomDataTable orders={orders} />
      </div>

      {/* Farmers Table */}
      <div className="mt-8">
        <Heading title="All Farmers (Pending & Active)" />
        <CustomDataTable
          data={farmers}
          columns={[
            { header: "Name", accessor: "name" },
            { header: "Email", accessor: "email" },
            { header: "Phone", accessor: "phone" },
            {
              header: "Active",
              accessor: "isActive",
              cell: (row) => (row.isActive ? "Yes" : "No"),
            },
            { header: "Status", accessor: "status" },
            { header: "Created At", accessor: "createdAt" },
          ]}
        />
      </div>

      {/* Users Table */}
      <div className="mt-8">
        <Heading title="All Users" />
        <CustomDataTable
          data={users}
          columns={[
            { header: "Name", accessor: "name" },
            { header: "Email", accessor: "email" },
            { header: "Role", accessor: "role" },
            { header: "Verified", accessor: "emailVerified", cell: (row) => (row.emailVerified ? "Yes" : "No") },
            { header: "Created At", accessor: "createdAt" },
          ]}
        />
      </div>
    </div>
  );
}
