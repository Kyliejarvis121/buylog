"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");
  const id = searchParams.get("id");

  const [status, setStatus] = useState("Verifying...");

  useEffect(() => {
    if (!token || !id) {
      setStatus("Invalid verification link");
      return;
    }

    async function verifyUser() {
      try {
        const res = await fetch("/api/users/verify", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token, id }),
        });

        const data = await res.json();

        if (!res.ok) {
          setStatus(data.message || "Verification failed");
          toast.error(data.message || "Verification failed");
          return;
        }

        setStatus("Your account has been successfully verified!");
        toast.success("Account verified successfully!");

        // Optionally redirect to login or dashboard after 3 seconds
        setTimeout(() => {
          router.push("/login"); // or "/farmer/dashboard"
        }, 3000);
      } catch (error) {
        console.error("Verification Error:", error);
        setStatus("Network error, please try again.");
        toast.error("Network error, please try again.");
      }
    }

    verifyUser();
  }, [token, id, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white shadow-lg p-6 rounded-lg text-center">
        <h1 className="text-2xl font-semibold mb-4">Email Verification</h1>
        <p className="text-gray-700">{status}</p>
      </div>
    </div>
  );
}
