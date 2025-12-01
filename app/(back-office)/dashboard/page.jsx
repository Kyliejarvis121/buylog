import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

import FarmerDashboard from "@/components/backoffice/FarmerDashboard";
import UserDashboard from "@/components/backoffice/UserDashboard";

import Heading from "@/components/backoffice/Heading";
import LargeCards from "@/components/backoffice/LargeCards";
import SmallCards from "@/components/backoffice/SmallCards";
import DashboardCharts from "@/components/backoffice/DashboardCharts";
import CustomDataTable from "@/components/backoffice/CustomDataTable";

import { getData } from "@/lib/getData";

export default async function DashboardPage() {
  try {
    // Get session
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return <div className="p-6 text-red-600">Not logged in</div>;
    }

    const role = session.user.role ?? "USER";
    const userId = session.user.id;

    // Fetch all data safely
    const endpoints = [
      "sales",
      "orders",
      "products",
      "farmers?includeInactive=true",
      "farmerSupport",
      "users",
    ];

    const results = await Promise.all(
      endpoints.map(async (ep) => {
        try {
          const res = await getData(ep);
          return res?.data ?? [];
        } catch (err) {
          console.error(`Failed to fetch ${ep}:`, err.message);
          return [];
        }
      })
    );

    const [sales, orders, products, farmers, supports, users] = results.map(
      (d) => JSON.parse(JSON.stringify(d))
    );

    // USER DASHBOARD
    if (role === "USER") {
      return <UserDashboard />;
    }

    // FARMER DASHBOARD
    if (role === "FARMER") {
      const salesById = sales.filter((s) => s.vendorId === userId) || [];
      const productsById = products.filter((p) => p.farmerId === userId) || [];

      return (
        <FarmerDashboard
          sales={salesById}
          products={productsById}
          supports={supports || []}
          farmerId={userId}
        />
      );
    }

    // ADMIN DASHBOARD
    return (
      <div className="p-6">
        <Heading title="Dashboard Overview" />
        <LargeCards
          sales={sales || []}
          products={products || []}
          farmers={farmers || []}
        />
        <SmallCards orders={orders || []} supports={supports || []} />
        <DashboardCharts sales={sales || []} />

        <div className="mt-8">
          <Heading title="Recent Orders" />
          <CustomDataTable data={orders || []} columns={[]} />
        </div>

        <div className="mt-8">
          <Heading title="All Farmers (Pending & Active)" />
          <CustomDataTable
            data={farmers || []}
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
            data={users || []}
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
  } catch (error) {
    console.error("Dashboard error:", error);
    return (
      <div className="p-6 text-red-600">
        Failed to load dashboard: {error?.message || "Unknown server error"}
      </div>
    );
  }
}
