import React from "react";
import Heading from "./Heading";
import LargeCards from "./LargeCards";
import SmallCards from "./SmallCards";
import DashboardCharts from "./DashboardCharts";
import ProductUpload from "./Farmer/ProductUpload"; // the improved upload component
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

export default async function FarmerDashboard({ sales, products, supports, farmerId }) {
  // get logged-in user's ID
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;

  return (
    <div className="p-6">
      <Heading title="Farmer Dashboard" />
      <LargeCards sales={sales || []} products={products || []} />
      <SmallCards orders={[]} supports={supports || []} />
      <DashboardCharts sales={sales || []} />

      <div className="mt-8">
        <Heading title="Upload New Product" />
        <ProductUpload farmerId={farmerId} userId={userId} /> {/* pass userId */}
      </div>
    </div>
  );
}
