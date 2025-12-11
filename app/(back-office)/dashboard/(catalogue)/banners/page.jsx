"use client"; // <-- important

// app/back-office/dashboard/category/banners/page.jsx
import { prisma } from "@/lib/prismadb";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { redirect } from "next/navigation";
import BannerTable from "./BannerTable";

export default async function BannersPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  let allBanners = [];
  try {
    allBanners = await prisma.banner.findMany({
      orderBy: { createdAt: "desc" },
    });
  } catch (error) {
    return (
      <div className="p-4 text-red-600">
        Failed to fetch banners: {error?.message || "Unknown error"}
      </div>
    );
  }

  return <BannerTable banners={allBanners} />;
}
