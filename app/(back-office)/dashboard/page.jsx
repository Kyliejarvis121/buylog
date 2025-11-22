export const dynamic = "force-dynamic";
export const revalidate = 0;

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { getData } from "@/lib/getData";
import Heading from "@/components/backoffice/Heading";
import LargeCards from "@/components/backoffice/LargeCards";
import SmallCards from "@/components/backoffice/SmallCards";
import DashboardCharts from "@/components/backoffice/DashboardCharts";

export default async function Page() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return <p className="p-4 text-red-600">Unauthorized</p>;
  }

  if (session.user.role !== "ADMIN") {
    return <p className="p-6 text-gray-600 text-center">Dashboard not available</p>;
  }

  const overview = await getData("dashboard/overview");

  return (
    <div>
      <Heading title="Dashboard Overview" />

      <LargeCards
        sales={overview.totalSales}
        orders={overview.totalOrders}
        products={overview.totalProducts}
      />

      <SmallCards
        users={overview.totalUsers}
        farmers={overview.totalFarmers}
      />

      <DashboardCharts sales={overview.recentSales} />
    </div>
  );
}

