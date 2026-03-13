"use client";

import { useEffect, useState } from "react";
import { signIn } from "next-auth/react";
import { useSearchParams, useRouter } from "next/navigation";

export default function VerifySuccess() {
  const params = useSearchParams();
  const email = params?.get("email");
  const router = useRouter();

  const [status, setStatus] = useState("Logging you in...");

  useEffect(() => {
    async function autoLogin() {
      if (!email) {
        setStatus("No email found. Please login.");
        return;
      }

      try {
        const res = await signIn("credentials", {
          email,
          redirect: false,
        });

        if (res?.error) {
          setStatus("Login failed. Please login manually.");
          return;
        }

        router.push("/dashboard");
      } catch (err) {
        console.error(err);
        setStatus("Something went wrong.");
      }
    }

    autoLogin();
  }, [email, router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-white p-6 rounded shadow text-center">
        <h1 className="text-xl font-bold text-green-600">
          Email Verified Successfully 🎉
        </h1>
        <p className="mt-2 text-gray-600">{status}</p>
      </div>
    </div>
  );
}