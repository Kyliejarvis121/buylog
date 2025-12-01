import React from "react";
import Heading from "./Heading";
import LargeCards from "./LargeCards";
import SmallCards from "./SmallCards";
import DashboardCharts from "./DashboardCharts";
import CustomDataTable from "./CustomDataTable";

export default function AdminDashboard({ sales, orders, products, farmers, supports, users }) {
  return (
    <div className="p-6">
      <Heading title="Dashboard Overview" />

      <LargeCards sales={sales} products={products} farmers={farmers} />
      <SmallCards orders={orders} supports={supports} />
      <DashboardCharts sales={sales} />

      <div className="mt-8">
        <Heading title="Recent Orders" />
        <CustomDataTable data={orders} columns={[/* order columns here */]} />
      </div>

      <div className="mt-8">
        <Heading title="All Farmers (Pending & Active)" />
        <CustomDataTable data={farmers} columns={[
          { header: "Name", accessor: "name" },
          { header: "Email", accessor: "email" },
          { header: "Phone", accessor: "phone" },
          { header: "Active", accessor: "isActive", cell: row => row.isActive ? "Yes" : "No" },
          { header: "Status", accessor: "status" },
          { header: "Created At", accessor: "createdAt" },
        ]} />
      </div>

      <div className="mt-8">
        <Heading title="All Users" />
        <CustomDataTable data={users} columns={[
          { header: "Name", accessor: "name" },
          { header: "Email", accessor: "email" },
          { header: "Role", accessor: "role" },
          { header: "Verified", accessor: "emailVerified", cell: row => row.emailVerified ? "Yes" : "No" },
          { header: "Created At", accessor: "createdAt" },
        ]} />
      </div>
    </div>
  );
}
