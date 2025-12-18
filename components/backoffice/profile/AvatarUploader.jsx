"use client";

import { UploadButton } from "@uploadthing/react";
import { useTransition } from "react";
import Image from "next/image";
import { updateProfileAvatar } from "@/components/Actions/profileActions";

export default function AvatarUploader({ avatar }) {
  const [isPending, startTransition] = useTransition();

  return (
    <div className="flex items-center gap-6">
      {/* Avatar Preview */}
      <Image
        src={avatar || "/avatar.png"}
        width={96}
        height={96}
        alt="Avatar"
        className="rounded-full border border-zinc-700 object-cover"
      />

      {/* Upload Button */}
      <UploadButton
        endpoint="farmerProfileUploader"
        appearance={{
          button:
            "bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded",
        }}
        onClientUploadComplete={(res) => {
          if (!res?.[0]?.url) return;

          startTransition(async () => {
            await updateProfileAvatar(res[0].url);
          });
        }}
        onUploadError={(error) => {
          alert(error.message);
        }}
      />

      {isPending && (
        <p className="text-sm text-zinc-400">Updating avatar...</p>
      )}
    </div>
  );
}
