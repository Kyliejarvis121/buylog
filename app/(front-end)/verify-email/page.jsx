"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  const [status, setStatus] = useState("Verifying...");

  useEffect(() => {
    if (!token) {
      setStatus("Invalid verification link");
      return;
    }

    async function verifyUser() {
      try {
        const res = await fetch(`/api/verify-email?token=${token}`, {
          method: "GET",
        });

        const data = await res.json();

        if (!res.ok) {
          setStatus(data.message || "Verification failed");
          toast.error(data.message || "Verification failed");
          return;
        }

        setStatus("Your account has been successfully verified!");
        toast.success("Account verified!");

        setTimeout(() => {
          router.push("/verify-success?email=" + encodeURIComponent(data.email));
        }, 2000);
      } catch (error) {
        setStatus("Network error");
        toast.error("Network error");
      }
    }

    verifyUser();
  }, [token, router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-white shadow p-6 rounded text-center">
        <h1 className="text-xl font-bold">Email Verification</h1>
        <p>{status}</p>
      </div>
    </div>
  );
}