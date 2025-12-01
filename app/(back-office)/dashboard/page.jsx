import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import AdminDashboard from "@/components/backoffice/AdminDashboard";
import FarmerDashboard from "@/components/backoffice/FarmerDashboard";
import UserDashboard from "@/components/backoffice/UserDashboard";
import { getData } from "@/lib/getData";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) return <div className="p-6 text-red-600">Not logged in</div>;

  const role = session.user?.role ?? "USER";
  const userId = session.user?.id;

  if (role === "USER") {
    return <UserDashboard />;
  }

  if (role === "FARMER") {
    return <FarmerDashboard userId={userId} />;
  }

  // Admin
  const [sales, orders, products, farmers, supports, users] = await Promise.all([
    getData("sales").then(r => r?.data || []),
    getData("orders").then(r => r?.data || []),
    getData("products").then(r => r?.data || []),
    getData("farmers?includeInactive=true").then(r => r?.data || []),
    getData("farmerSupport").then(r => r?.data || []),
    getData("users").then(r => r?.data || []),
  ]);

  return (
    <AdminDashboard
      sales={sales}
      orders={orders}
      products={products}
      farmers={farmers}
      supports={supports}
      users={users}
    />
  );
}
