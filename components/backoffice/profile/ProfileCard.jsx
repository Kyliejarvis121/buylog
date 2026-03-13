"use client";

import Image from "next/image";
import Link from "next/link";

export default function ProfileCard({ user }) {
  if (!user) return null;

  const farmer = user.farmers?.[0];

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-lg">
      {/* HEADER */}
      <div className="flex items-center gap-4">
        <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-zinc-700">
          <Image
            src={user.profile?.avatar || "/avatar.png"}
            alt="Profile Avatar"
            fill
            className="object-cover"
          />
        </div>

        <div>
          <p className="text-lg font-semibold text-zinc-100">
            {user.name}
          </p>
          <p className="text-sm text-zinc-400">{user.email}</p>

          <span className="inline-block mt-1 px-2 py-0.5 text-xs rounded-full bg-emerald-600 text-white">
            {user.role}
          </span>
        </div>
      </div>

      {/* FARMER INFO */}
      {farmer && (
        <div className="mt-4 bg-zinc-800 rounded-lg p-3">
          <p className="text-xs text-zinc-400 uppercase mb-1">
            Farm
          </p>
          <p className="text-sm font-medium text-zinc-100">
            {farmer.name}
          </p>
          <p className="text-xs mt-1 text-emerald-400">
            {farmer.isActive ? "Active" : "Inactive"}
          </p>
        </div>
      )}

      {/* ACTIONS */}
      <div className="mt-4 flex gap-3">
        <Link
          href="/dashboard/profile"
          className="flex-1 text-center text-sm py-2 rounded-lg bg-blue-600 hover:bg-blue-700 transition text-white"
        >
          View Profile
        </Link>

        <Link
          href="/dashboard/profile/edit"
          className="flex-1 text-center text-sm py-2 rounded-lg bg-zinc-700 hover:bg-zinc-600 transition text-white"
        >
          Edit
        </Link>
      </div>
    </div>
  );
}
