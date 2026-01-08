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
    <div className="fixed top-0 z-50 flex h-20 w-full items-center justify-between bg-white px-8 py-8 text-slate-50 dark:bg-slate-800 sm:pr-[20rem]">
      
      {/* LEFT SIDE */}
      <div className="flex items-center gap-4">
        {/* Sidebar Toggle */}
        <button
          onClick={() => setShowSidebar(!showSidebar)}
          className="text-lime-700 dark:text-lime-500"
        >
          <AlignJustify />
        </button>

        {/* Home Button */}
        <Link
          href="/"
          className="flex items-center gap-2 rounded-lg border border-lime-300 bg-lime-50 px-3 py-2 text-sm font-medium text-lime-800 transition hover:bg-lime-100 dark:border-lime-600 dark:bg-slate-700 dark:text-lime-400 dark:hover:bg-slate-600"
        >
          <LayoutDashboard size={18} />

          <div className="hidden sm:flex flex-col leading-tight">
            <span className="font-semibold">Home</span>
            <span className="text-xs opacity-80">
              View your products
            </span>
          </div>
        </Link>
      </div>

      {/* RIGHT SIDE */}
      <div className="flex items-center space-x-3">
        <ThemeSwitcherBtn />

        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="relative inline-flex items-center rounded-lg bg-transparent p-3 text-sm font-medium"
            >
              <Bell className="text-lime-700 dark:text-lime-500" />
              <span className="sr-only">Notifications</span>

              <div className="absolute -top-0 end-6 inline-flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
                20
              </div>
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent className="px-4 py-2 pr-8">
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
                      className="h-8 w-8 rounded-full"
                    />

                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium">
                        Yellow Sweet Corn Stock out
                      </p>

                      <div className="flex items-center space-x-2 text-xs">
                        <p className="rounded-full bg-red-700 px-3 py-0.5 text-white">
                          Stock Out
                        </p>
                        <p>Dec 12 2021 - 12:40PM</p>
                      </div>
                    </div>

                    <button className="text-slate-400 hover:text-red-500">
                      <X size={16} />
                    </button>
                  </div>
                </DropdownMenuItem>

                <DropdownMenuSeparator />
              </React.Fragment>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* User Avatar */}
        {status === "authenticated" && (
          <UserAvatar user={session?.user} />
        )}
      </div>
    </div>
  );
}
