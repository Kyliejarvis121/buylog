import React from "react";
import Heading from "./Heading";
import LargeCards from "./LargeCards";
import SmallCards from "./SmallCards";
import DashboardCharts from "./DashboardCharts";
import ProductUpload from "./Farmer/ProductUpload"; // improved upload component
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

export default async function FarmerDashboard({ sales, products, supports }) {
  const session = await getServerSession(authOptions);
  if (!session) return <div>Please login to view your dashboard</div>;

  const userId = session.user.id;

  return (
    <div className="p-6">
      <Heading title="Farmer Dashboard" />
      <LargeCards sales={sales || []} products={products || []} />
      <SmallCards orders={[]} supports={supports || []} />
      <DashboardCharts sales={sales || []} />

      <div className="mt-8">
        <Heading title="Upload New Product" />
        <ProductUpload farmerId={userId} /> {/* farmerId from session */}
      </div>
    </div>
  );
}
