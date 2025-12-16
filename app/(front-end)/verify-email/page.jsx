"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState("Verifying...");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = searchParams.get("token");
    const id = searchParams.get("id");

    if (!token || !id) {
      setStatus("Invalid verification link.");
      setLoading(false);
      return;
    }

    const verifyEmail = async () => {
      try {
        const res = await fetch("/api/users", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token, id }),
        });

        const data = await res.json();
        if (res.ok && data.data?.emailVerified) {
          setStatus("✅ Email verified successfully! Redirecting to login...");
          setTimeout(() => router.push("/login"), 3000);
        } else {
          setStatus("❌ Verification failed: " + data.message);
        }
      } catch (error) {
        console.error(error);
        setStatus("❌ Verification failed. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    verifyEmail();
  }, [searchParams, router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="max-w-xl p-6 bg-white shadow rounded text-center">
        <h1 className="text-2xl font-semibold mb-4">Email Verification</h1>
        <p className="text-gray-700">{status}</p>
        {loading && <p className="mt-4 text-sm text-gray-400">Processing...</p>}
      </div>
    </div>
  );
}
