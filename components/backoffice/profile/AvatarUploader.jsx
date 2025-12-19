"use client";

import { UploadButton } from "@uploadthing/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Image from "next/image";

export default function AvatarUploader({ currentAvatar }) {
  const router = useRouter();
  const [preview, setPreview] = useState(currentAvatar);

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Avatar Preview */}
      <div className="relative w-24 h-24 rounded-full overflow-hidden border border-zinc-600">
        <Image
          src={preview || "/avatar.png"}
          alt="Avatar"
          fill
          className="object-cover"
        />
      </div>

      {/* Upload Button */}
      <UploadButton
        endpoint="customerProfileUploader"
        appearance={{
          button:
            "ut-button:bg-emerald-600 ut-button:hover:bg-emerald-700",
        }}
        onClientUploadComplete={async (res) => {
          const avatarUrl = res?.[0]?.url;
          if (!avatarUrl) return;

          setPreview(avatarUrl);

          await fetch("/api/profile/avatar", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ avatar: avatarUrl }),
          });

          router.refresh();
        }}
        onUploadError={(error) => {
          alert(error.message);
        }}
      />
    </div>
  );
}
