import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import AdminDashboard from "@/components/backoffice/AdminDashboard";
import FarmerDashboard from "@/components/backoffice/FarmerDashboard";
import UserDashboard from "@/components/backoffice/UserDashboard";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) return <div className="p-6 text-red-600">Not logged in</div>;

  const role = session.user?.role ?? "USER";
  const userId = session.user?.id;

  // Dynamically render based on role
  if (role === "ADMIN") {
    return <AdminDashboard user={session.user} />;
  }

  if (role === "FARMER") {
    return <FarmerDashboard userId={userId} />;
  }

  // Default to User dashboard
  return <UserDashboard />;
}
