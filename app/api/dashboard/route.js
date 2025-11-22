export const dynamic = "force-dynamic";
export const revalidate = 0;

import Heading from "@/components/backoffice/Heading";
import LargeCards from "@/components/backoffice/LargeCards";
import SmallCards from "@/components/backoffice/SmallCards";
import DashboardCharts from "@/components/backoffice/DashboardCharts";
import FarmerDashboard from "@/components/backoffice/FarmerDashboard";
import UserDashboard from "@/components/backoffice/UserDashboard";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prismadb";

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

  // Admin dashboard data
  let sales = [];
  let orders = [];
  let products = [];

  if (role === "ADMIN") {
    try {
      sales = await prisma.sales.findMany({ orderBy: { createdAt: "desc" } });
      orders = await prisma.orders.findMany({ orderBy: { createdAt: "desc" } });
      products = await prisma.products.findMany({ orderBy: { createdAt: "desc" } });
    } catch (error) {
      console.error("Dashboard fetch error:", error);
    }
  }

  if (role === "USER") return <UserDashboard />;
  if (role === "FARMER") return <FarmerDashboard />;

  return (
    <div>
      <Heading title="Dashboard Overview" />
      <LargeCards sales={sales} />
      <SmallCards orders={orders} />
      <DashboardCharts sales={sales} />
    </div>
  );
}
