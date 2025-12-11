"use client";

import React, { useEffect, useState } from "react";
import { columns } from "./columns";
import DataTable from "@/components/data-table-components/DataTable";
import PageHeader from "@/components/backoffice/PageHeader";

export default function BannersPage() {
  const [banners, setBanners] = useState([]);

  useEffect(() => {
    fetch("/api/banners")
      .then((res) => res.json())
      .then((data) => setBanners(data))
      .catch(console.error);
  }, []);

  return (
    <div className="container mx-auto py-8">
      <PageHeader heading="Banners" href="/dashboard/banners/new" linkTitle="Add Banner" />
      <div className="py-8">
        <DataTable data={banners} columns={columns} />
      </div>
    </div>
  );
}
