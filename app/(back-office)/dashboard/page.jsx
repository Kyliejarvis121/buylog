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

  if (!session) return <div className="p-6 text-red-600">Not logged in</div>;

  const role = session.user?.role ?? "USER";

  // Safe fetch helper
  async function safe(endpoint) {
    try {
      const res = await getData(endpoint);
      return res?.data || [];
    } catch (e) {
      console.error("FAILED:", endpoint, e.message);
      return [];
    }
  }

  // Fetch all required data
  const [sales, orders, products, farmers, supports, users] = await Promise.all([
    safe("sales"),
    safe("orders"),
    safe("products"),
    safe("farmers?includeInactive=true"),
    safe("farmerSupport"),
    safe("users"),
  ]);

  // -------------------
  // USER DASHBOARD
  // -------------------
  if (role === "USER") {
    return <UserDashboard orders={orders} />;
  }

  // -------------------
  // FARMER DASHBOARD
  // -------------------
  if (role === "FARMER") {
    return (
      <div className="p-6">
        <Heading title="Dashboard Overview" />

        {/* LargeCards: Farmer can see sales, products (but not farmers/users) */}
        <LargeCards sales={sales} products={products} />

        {/* SmallCards: only orders/supports relevant */}
        <SmallCards orders={orders} supports={supports} />

        <DashboardCharts sales={sales} />

        <div className="mt-8">
          <Heading title="Your Products" />
          <CustomDataTable data={products} columns={[ /* product columns */ ]} />
        </div>

        <div className="mt-8">
          <Heading title="Support Requests" />
          <CustomDataTable data={supports} columns={[ /* support columns */ ]} />
        </div>
      </div>
    );
  }

  // -------------------
  // ADMIN DASHBOARD
  // -------------------
  return (
    <div className="p-6">
      <Heading title="Dashboard Overview" />

      <LargeCards sales={sales} products={products} farmers={farmers} />

      <SmallCards orders={orders} supports={supports} />

      <DashboardCharts sales={sales} />

      <div className="mt-8">
        <Heading title="Recent Orders" />
        <CustomDataTable orders={orders} />
      </div>

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

      <div className="mt-8">
        <Heading title="All Users" />
        <CustomDataTable
          data={users}
          columns={[
            { header: "Name", accessor: "name" },
            { header: "Email", accessor: "email" },
            { header: "Role", accessor: "role" },
            {
              header: "Verified",
              accessor: "emailVerified",
              cell: (row) => (row.emailVerified ? "Yes" : "No"),
            },
            { header: "Created At", accessor: "createdAt" },
          ]}
        />
      </div>
    </div>
  );
}
