"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LayoutDashboard, LogOut, Settings } from "lucide-react";
import { generateInitials } from "@/lib/generateInitials";

export default function UserAvatar({ user = {} }) {
  const { name, image, avatar, role } = user;
  const router = useRouter();
  const initials = generateInitials(name || "U");

  async function handleLogout() {
    await signOut();
    router.push("/");
  }

  // Use either `image` or `avatar` field as source
  const src = image || avatar || "/avatar.png";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <button className="focus:outline-none">
          {src ? (
            <Image
              src={src}
              alt={name || "User"}
              width={36}
              height={36}
              className="rounded-full object-cover border border-zinc-600"
            />
          ) : (
            <div className="w-9 h-9 flex items-center justify-center rounded-full bg-zinc-200 dark:bg-zinc-800 text-xs font-semibold text-zinc-900 dark:text-zinc-100 border border-zinc-600">
              {initials}
            </div>
          )}
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-44">
        <DropdownMenuLabel>{name || "User"}</DropdownMenuLabel>
        <DropdownMenuSeparator />

        <DropdownMenuItem asChild>
          <Link href="/dashboard">Dashboard</Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <Link href="/dashboard/profile">My Profile</Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <Link href="/dashboard/settings">Settings</Link>
        </DropdownMenuItem>

        <DropdownMenuItem>
          <button
            onClick={handleLogout}
            className="flex items-center space-x-2 text-red-600"
          >
            <LogOut className="h-4 w-4" />
            <span>Logout</span>
          </button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
