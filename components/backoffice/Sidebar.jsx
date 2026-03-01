"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import logo from "../../public/limiLogo.webp.png";
import {
  Boxes,
  Building2,
  ChevronDown,
  ChevronRight,
  CircleDollarSign,
  ExternalLink,
  HeartHandshake,
  LayoutGrid,
  LayoutList,
  LogOut,
  MonitorPlay,
  ScanSearch,
  SendToBack,
  Slack,
  Truck,
  User,
  UserSquare2,
  Users2,
  Warehouse,
} from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { usePathname, useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";

export default function Sidebar({ showSidebar, setShowSidebar }) {
  const [openMenu, setOpenMenu] = useState(false);
  const router = useRouter();
  const { data: session, status } = useSession();
  const pathname = usePathname();

  if (status === "loading") {
    return <p className="p-4">Loading...</p>;
  }

  const role = session?.user?.role?.toUpperCase(); // normalize
  const userStatus = session?.user?.status ?? true;

  let sidebarLinks = [];
  let catalogueLinks = [];

  // ADMIN LINKS
  if (role === "ADMIN") {
    sidebarLinks = [
      { title: "Dashboard", icon: LayoutGrid, href: "/dashboard" },
      { title: "Customers", icon: Users2, href: "/dashboard/customers" },
      { title: "Markets", icon: Warehouse, href: "/dashboard/markets" },
      { title: "Farmers", icon: UserSquare2, href: "/dashboard/farmers" },
      { title: "Orders", icon: Truck, href: "/dashboard/orders" },
      { title: "Sales", icon: Truck, href: "/dashboard/sales" },
      { title: "Our Staff", icon: User, href: "/dashboard/staff" },
      { title: "Community", icon: Building2, href: "/dashboard/community" },
      { title: "Wallet", icon: CircleDollarSign, href: "/dashboard/wallet" },
      { title: "Support", icon: HeartHandshake, href: "/dashboard/farmer-support" },
      { title: "Settings", icon: LayoutGrid, href: "/dashboard/settings" },
      { title: "Online Store", icon: ExternalLink, href: "/" },
    ];

    catalogueLinks = [
      { title: "Products", icon: Boxes, href: "/dashboard/products" },
      { title: "Categories", icon: LayoutList, href: "/dashboard/categories" },
      { title: "Coupons", icon: ScanSearch, href: "/dashboard/coupons" },
      { title: "Banners", icon: MonitorPlay, href: "/dashboard/banners" },
    ];
  }

  // FARMER LINKS
  if (role === "FARMER") {
    sidebarLinks = [
      { title: "Dashboard", icon: LayoutGrid, href: "/dashboard" },
      { title: "Inbox", icon: SendToBack, href: "/dashboard/inbox" },
      { title: "Settings", icon: LayoutGrid, href: "/dashboard/settings" },
      { title: "Online Store", icon: ExternalLink, href: "/" },
    ];

    catalogueLinks = [
      { title: "All Products", icon: Boxes, href: "/dashboard/farmers/products" },
      { title: "Add Product", icon: Boxes, href: "/dashboard/farmers/products/new" },
    ];
  }

  // USER LINKS
  if (role === "USER") {
    sidebarLinks = [
      { title: "My Orders", icon: Truck, href: "/dashboard/orders" },
      { title: "Profile", icon: User, href: "/dashboard/profile" },
      { title: "Online Store", icon: ExternalLink, href: "/" },
    ];
    catalogueLinks = [];
  }

  // INACTIVE FARMER
  if (role === "FARMER" && userStatus === false) {
    sidebarLinks = [];
    catalogueLinks = [];
  }

  async function handleLogout() {
    await signOut();
    router.push("/");
  }

  return (
    <div
      className={
        showSidebar
          ? "sm:block mt-20 sm:mt-0 dark:bg-slate-800 bg-white space-y-6 w-64 h-screen text-slate-800 dark:text-slate-300 fixed left-0 top-0 shadow-md overflow-y-scroll"
          : "mt-20 sm:mt-0 hidden sm:block dark:bg-slate-800 bg-white space-y-6 w-64 h-screen text-slate-800 dark:text-slate-300 fixed left-0 top-0 shadow-md overflow-y-scroll"
      }
    >
      <Link onClick={() => setShowSidebar(false)} className="px-6 py-4" href="/dashboard">
        <Image src={logo} alt="Buylog logo" className="w-36" />
      </Link>

      <div className="space-y-3 flex flex-col">
        {sidebarLinks.map((item, i) => {
          const Icon = item.icon;
          return (
            <Link
              onClick={() => setShowSidebar(false)}
              key={i}
              href={item.href}
              className={
                pathname === item.href
                  ? "flex items-center space-x-3 px-6 py-2 border-l-8 border-lime-500 text-lime-500"
                  : "flex items-center space-x-3 px-6 py-2"
              }
            >
              <Icon />
              <span>{item.title}</span>
            </Link>
          );
        })}

        {catalogueLinks.length > 0 && (
          <Collapsible className="px-6">
            <CollapsibleTrigger onClick={() => setOpenMenu(!openMenu)}>
              <button className="flex items-center space-x-6 py-2">
                <div className="flex items-center space-x-3">
                  <Slack />
                  <span>Catalogue</span>
                </div>
                {openMenu ? <ChevronDown /> : <ChevronRight />}
              </button>
            </CollapsibleTrigger>

            <CollapsibleContent className="rounded-lg py-3 px-3 pl-6 dark:bg-slate-800 dark:text-slate-300">
              {catalogueLinks.map((item, i) => {
                const Icon = item.icon;
                return (
                  <Link
                    onClick={() => setShowSidebar(false)}
                    key={i}
                    href={item.href}
                    className={
                      pathname === item.href
                        ? "flex items-center space-x-3 py-1 text-sm text-lime-500"
                        : "flex items-center space-x-3 py-1"
                    }
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.title}</span>
                  </Link>
                );
              })}
            </CollapsibleContent>
          </Collapsible>
        )}

        {/* LOGOUT */}
        <div className="px-6 py-2">
          <button
            onClick={handleLogout}
            className="bg-lime-600 rounded-md flex items-center space-x-3 px-6 py-3 w-full"
          >
            <LogOut />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
}