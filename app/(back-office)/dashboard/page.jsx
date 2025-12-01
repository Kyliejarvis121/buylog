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
  const session = await getServerSession(authOptions);

  if (!session) {
    return <div className="p-6 text-red-600">Not logged in</div>;
  }

  const role = session.user?.role ?? "USER";
  const userId = session.user?.id;

  // USER DASHBOARD
  if (role === "USER") {
    return <UserDashboard />;
  }

  // Fetch all necessary data on server
  const [salesRes, ordersRes, productsRes, farmersRes, supportsRes, usersRes] = await Promise.all([
    getData("sales"),
    getData("orders"),
    getData("products"),
    getData("farmers?includeInactive=true"),
    getData("farmerSupport"),
    getData("users"),
  ]);

  // Serialize to remove circular refs
  const sales = JSON.parse(JSON.stringify(salesRes?.data || []));
  const orders = JSON.parse(JSON.stringify(ordersRes?.data || []));
  const products = JSON.parse(JSON.stringify(productsRes?.data || []));
  const farmers = JSON.parse(JSON.stringify(farmersRes?.data || []));
  const supports = JSON.parse(JSON.stringify(supportsRes?.data || []));
  const users = JSON.parse(JSON.stringify(usersRes?.data || []));

  // FARMER DASHBOARD
  if (role === "FARMER") {
    // Filter data for this farmer only
    const salesById = sales.filter(s => s.vendorId === userId);
    const productsById = products.filter(p => p.farmerId === userId);

    return (
      <FarmerDashboard
        sales={salesById}
        products={productsById}
        supports={supports}
        farmerId={userId}
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

      <div className="mt-8">
        <Heading title="Recent Orders" />
        <CustomDataTable data={orders} columns={[ /* order columns here */ ]} />
      </div>

      <div className="mt-8">
        <Heading title="All Farmers (Pending & Active)" />
        <CustomDataTable
          data={farmers}
          columns={[
            { header: "Name", accessor: "name" },
            { header: "Email", accessor: "email" },
            { header: "Phone", accessor: "phone" },
            { header: "Active", accessor: "isActive", cell: row => row.isActive ? "Yes" : "No" },
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
            { header: "Verified", accessor: "emailVerified", cell: row => row.emailVerified ? "Yes" : "No" },
            { header: "Created At", accessor: "createdAt" },
          ]}
        />
      </div>
    </div>
  );
}
