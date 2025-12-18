"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { UploadButton } from "@uploadthing/react";
import { useRouter } from "next/navigation";

export default function EditProfileForm({ profile }) {
  const router = useRouter();
  const [form, setForm] = useState({
    avatar: profile?.avatar || "",
    phone: profile?.phone || "",
    address: profile?.address || "",
    country: profile?.country || "",
    bio: profile?.bio || "",
  });

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const res = await fetch("/api/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      toast.success("Profile updated");
      router.refresh();
    } else {
      toast.error("Update failed");
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-zinc-800 p-6 rounded-xl space-y-4"
    >
      {/* AVATAR UPLOAD */}
      <div>
        <p className="text-sm mb-2 text-zinc-300">Profile Picture</p>

        <UploadButton
          endpoint="customerProfileUploader"
          onClientUploadComplete={(res) => {
            setForm({ ...form, avatar: res[0].url });
            toast.success("Image uploaded");
          }}
          onUploadError={(error) => {
            toast.error(error.message);
          }}
        />
      </div>

      <Input label="Phone" name="phone" value={form.phone} onChange={handleChange} />
      <Input label="Address" name="address" value={form.address} onChange={handleChange} />
      <Input label="Country" name="country" value={form.country} onChange={handleChange} />

      <div>
        <label className="text-sm text-zinc-300">Bio</label>
        <textarea
          name="bio"
          value={form.bio}
          onChange={handleChange}
          className="w-full mt-1 bg-zinc-900 border border-zinc-700 rounded-lg p-2 text-white"
          rows={3}
        />
      </div>

      <button className="bg-emerald-600 hover:bg-emerald-700 px-4 py-2 rounded-lg text-white">
        Save Profile
      </button>
    </form>
  );
}

function Input({ label, ...props }) {
  return (
    <div>
      <label className="text-sm text-zinc-300">{label}</label>
      <input
        {...props}
        className="w-full mt-1 bg-zinc-900 border border-zinc-700 rounded-lg p-2 text-white"
      />
    </div>
  );
}
