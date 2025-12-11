"use client"; // <-- important

import React, { useEffect, useState } from "react";
import PageHeader from "@/components/backoffice/PageHeader";
import DataTable from "@/components/data-table-components/DataTable";

// Columns must be inside client context
const columns = [
  { Header: "Title", accessor: "title" },
  {
    Header: "Image",
    accessor: "imageUrl",
    Cell: ({ value }) => (
      <img src={value} alt="Banner" className="w-32 h-16 object-cover" />
    ),
  },
  {
    Header: "Link",
    accessor: "link",
    Cell: ({ value }) => (value ? <a href={value}>{value}</a> : "-"),
  },
  { Header: "Active", accessor: "isActive", Cell: ({ value }) => (value ? "Yes" : "No") },
  {
    Header: "Created At",
    accessor: "createdAt",
    Cell: ({ value }) => new Date(value).toLocaleString(),
  },
];

export default function BannersPage() {
  const [allBanners, setAllBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch banners from API route
  useEffect(() => {
    fetch("/api/banners")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setAllBanners(data.data);
        } else {
          setError(data.message || "Failed to fetch banners");
        }
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-4">Loading banners...</div>;
  if (error) return <div className="p-4 text-red-600">{error}</div>;

  return (
    <div className="container mx-auto py-8">
      <PageHeader
        heading="Banners"
        href="/dashboard/banners/new"
        linkTitle="Add Banner"
      />
      <div className="py-8">
        <DataTable data={allBanners} columns={columns} />
      </div>
    </div>
  );
}
