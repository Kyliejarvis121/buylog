"use client";

import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LayoutDashboard, LogOut, Settings } from "lucide-react";
import Image from "next/image";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { generateInitials } from "@/lib/generateInitials";

export default function UserAvatar({ user = {} }) {
  const { name, image, role } = user;
  const initials = generateInitials(name || "U");

  // ✅ FIXED LOGOUT (No More React Crash)
  async function handleLogout() {
    await signOut({ redirect: false });
    window.location.href = "/login";
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center">
          {image ? (
            <Image
              src={image}
              alt={name || "User profile"}
              width={32}
              height={32}
              className="w-8 h-8 rounded-full object-cover"
            />
          ) : (
            <div className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-50 dark:bg-slate-800 shadow-md border border-slate-600 text-xs font-semibold text-zinc-900 dark:text-zinc-100">
              {initials}
            </div>
          )}
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="py-2 px-4 pr-8">
        <DropdownMenuLabel>{name || "User"}</DropdownMenuLabel>
        <DropdownMenuSeparator />

        <DropdownMenuItem asChild>
          <Link href="/dashboard" className="flex items-center space-x-2">
            <LayoutDashboard className="mr-2 h-4 w-4" />
            <span>Dashboard</span>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <Link href="/dashboard/profile" className="flex items-center space-x-2">
            <Settings className="mr-2 h-4 w-4" />
            <span>Edit Profile</span>
          </Link>
        </DropdownMenuItem>

        {role === "USER" && (
          <DropdownMenuItem asChild>
            <Link href="/dashboard/orders" className="flex items-center space-x-2">
              <Settings className="mr-2 h-4 w-4" />
              <span>My Orders</span>
            </Link>
          </DropdownMenuItem>
        )}

        <DropdownMenuItem>
          <button
            onClick={handleLogout}
            className="flex items-center space-x-2 w-full text-left"
          >
            <LogOut className="mr-2 h-4 w-4" />
            <span>Logout</span>
          </button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}