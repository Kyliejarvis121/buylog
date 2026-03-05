"use client";

import {
  AlignJustify,
  Bell,
  X,
} from "lucide-react";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ThemeSwitcherBtn from "../ThemeSwitcherBtn";
import UserAvatar from "./UserAvatar";
import { useSession } from "next-auth/react";

export default function Navbar({ setShowSidebar, showSidebar }) {
  const { data: session, status } = useSession();
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    fetch("/api/notifications")
      .then((res) => res.json())
      .then((data) => setNotifications(data.notifications || []))
      .catch(() => setNotifications([]));
  }, []);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const markAsRead = async (id) => {
    try {
      await fetch("/api/notifications/read", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      setNotifications((prev) =>
        prev.map((n) =>
          n.id === id ? { ...n, isRead: true } : n
        )
      );
    } catch (err) {
      console.error("Failed to mark notification as read", err);
    }
  };

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  return (
    <div className="fixed top-0 z-50 flex h-20 w-full items-center justify-between bg-white px-8 py-8 dark:bg-slate-800 sm:pr-[20rem]">

      {/* LEFT SIDE */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => setShowSidebar(!showSidebar)}
          className="text-lime-700 dark:text-lime-500"
        >
          <AlignJustify />
        </button>
      </div>

      {/* RIGHT SIDE */}
      <div className="flex items-center space-x-3">
        <ThemeSwitcherBtn />

        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="relative inline-flex items-center rounded-lg bg-transparent p-3"
            >
              <Bell className="text-lime-700 dark:text-lime-500" />
              <span className="sr-only">Notifications</span>

              {unreadCount > 0 && (
                <div className="absolute -top-0 end-6 inline-flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
                  {unreadCount}
                </div>
              )}
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent className="px-4 py-2 pr-8">
            <DropdownMenuLabel>Notifications</DropdownMenuLabel>
            <DropdownMenuSeparator />

            {notifications.length === 0 && (
              <DropdownMenuItem>
                <p className="text-sm text-slate-500">No notifications</p>
              </DropdownMenuItem>
            )}

            {notifications.map((notification) => (
              <React.Fragment key={notification.id}>
                <DropdownMenuItem>
                  <div className="flex items-center space-x-2 w-full">

                    <Image
                      src="/profile.JPG"
                      alt="User profile"
                      width={200}
                      height={200}
                      className="h-8 w-8 rounded-full"
                    />

                    <div className="flex flex-col space-y-1 flex-1">
                      <p className="text-sm font-medium">
                        {notification.message}
                      </p>

                      <div className="flex items-center space-x-2 text-xs">
                        {notification.type && (
                          <p className="rounded-full bg-red-700 px-3 py-0.5 text-white">
                            {notification.type}
                          </p>
                        )}
                        <p>
                          {new Date(notification.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </div>

                    {!notification.isRead && (
                      <button
                        onClick={() => markAsRead(notification.id)}
                        className="text-xs text-lime-600 hover:underline"
                      >
                        Mark read
                      </button>
                    )}

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