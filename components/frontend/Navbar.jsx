"use client";
import React, { useState } from "react";
import SearchForm from "./SearchForm";
import Link from "next/link";
import Image from "next/image";
import logo from "../../public/limiLogo.webp.png";
import {
  HelpCircle,
  ShoppingCart,
  User,
  Menu,
  X,
} from "lucide-react";
import ThemeSwitcherBtn from "../ThemeSwitcherBtn";
import HelpModal from "./HelpModal";
import CartCount from "./CartCount";
import { useSession } from "next-auth/react";
import UserAvatar from "../backoffice/UserAvatar";

export default function Navbar() {
  const { data: session, status } = useSession();
  const [open, setOpen] = useState(false);

  if (status === "loading") {
    return null;
  }

  return (
    <header className="bg-white dark:bg-slate-700 border-b">
      <div className="max-w-6xl mx-auto px-4 py-3">
        {/* TOP BAR */}
        <div className="flex items-center justify-between">
          {/* LOGO */}
          <Link href="/" className="flex-shrink-0">
            <Image
              src={logo}
              alt="Buylog logo"
              width={120}
              height={40}
              className="w-24 sm:w-28 h-auto"
              priority
            />
          </Link>

          {/* DESKTOP SEARCH */}
          <div className="hidden md:flex flex-grow mx-6">
            <SearchForm />
          </div>

          {/* DESKTOP ACTIONS */}
          <div className="hidden md:flex items-center gap-6">
            {status === "unauthenticated" ? (
              <Link
                href="/login"
                className="flex items-center gap-1 text-green-950 dark:text-slate-100"
              >
                <User size={20} />
                <span>Login</span>
              </Link>
            ) : (
              <UserAvatar user={session?.user} />
            )}

            <HelpModal />
            <CartCount />
            <ThemeSwitcherBtn />
          </div>

          {/* MOBILE MENU BUTTON */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden"
          >
            {open ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>

        {/* MOBILE SEARCH */}
        <div className="md:hidden mt-3">
          <SearchForm />
        </div>

        {/* MOBILE MENU */}
        {open && (
          <div className="md:hidden mt-4 space-y-4 border-t pt-4">
            {status === "unauthenticated" ? (
              <Link
                href="/login"
                className="flex items-center gap-2"
                onClick={() => setOpen(false)}
              >
                <User />
                Login
              </Link>
            ) : (
              <UserAvatar user={session?.user} />
            )}

            <div className="flex items-center gap-2">
              <HelpCircle />
              <HelpModal />
            </div>

            <CartCount />

            <ThemeSwitcherBtn />
          </div>
        )}
      </div>
    </header>
  );
}
