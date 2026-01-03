"use client";
import {
  AlignJustify,
  Bell,
  LayoutDashboard,
  X,
} from "lucide-react";
import Image from "next/image";
import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ThemeSwitcherBtn from "../ThemeSwitcherBtn";
import Link from "next/link";
import UserAvatar from "./UserAvatar";
import { useSession } from "next-auth/react";

export default function Navbar({ setShowSidebar, showSidebar }) {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  return (
    <div className="flex items-center justify-between bg-white dark:bg-slate-800 text-slate-50 h-20 py-8 fixed top-0 w-full px-8 z-50 sm:pr-[20rem]">

      {/* LEFT SIDE */}
      <div className="flex items-center gap-4">
        {/* Sidebar toggle */}
        <button
          onClick={() => setShowSidebar(!showSidebar)}
          className="text-lime-700 dark:text-lime-500"
        >
          <AlignJustify />
        </button>

        {/* HOME BUTTON → BuyLog Homepage */}
        <Link
          href="/"
          className="hidden sm:flex items-center gap-2 text-sm font-medium text-lime-700 dark:text-lime-500 hover:text-lime-800"
        >
          <LayoutDashboard size={18} />
          Home
        </Link>
      </div>

      {/* RIGHT SIDE */}
      <div className="flex space-x-3">
        <ThemeSwitcherBtn />

        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger>
            <button
              type="button"
              className="relative inline-flex items-center p-3 text-sm font-medium text-center bg-transparent rounded-lg"
            >
              <Bell className="text-lime-700 dark:text-lime-500" />
              <span className="sr-only">Notifications</span>
              <div className="absolute inline-flex items-center justify-center w-6 h-6 text-xs font-bold text-white bg-red-500 rounded-full -top-0 end-6">
                20
              </div>
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent className="py-2 px-4 pr-8">
            <DropdownMenuLabel>Notifications</DropdownMenuLabel>
            <DropdownMenuSeparator />

            {[1, 2, 3].map((item) => (
              <React.Fragment key={item}>
                <DropdownMenuItem>
                  <div className="flex items-center space-x-2">
                    <Image
                      src="/profile.JPG"
                      alt="User profile"
                      width={200}
                      height={200}
                      className="w-8 h-8 rounded-full"
                    />
                    <div className="flex flex-col space-y-1">
                      <p>Yellow Sweet Corn Stock out</p>
                      <div className="flex items-center space-x-2">
                        <p className="px-3 py-0.5 bg-red-700 text-white rounded-full text-sm">
                          Stock Out
                        </p>
                        <p>Dec 12 2021 - 12:40PM</p>
                      </div>
                    </div>
                    <button>
                      <X />
                    </button>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
              </React.Fragment>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {status === "authenticated" && <UserAvatar user={session?.user} />}
      </div>
    </div>
  );
}
