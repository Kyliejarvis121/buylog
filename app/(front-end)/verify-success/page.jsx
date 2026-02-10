"use client";

import { useEffect } from "react";
import { signIn } from "next-auth/react";
import { useSearchParams, useRouter } from "next/navigation";

export default function VerifySuccess() {
  const params = useSearchParams();
  const email = params.get("email");
  const router = useRouter();

  useEffect(() => {
    async function autoLogin() {
      if (!email) return;

      const res = await signIn("credentials", {
        email,
        redirect: false,
      });

      if (!res?.error) {
        router.push("/dashboard");
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
        <p className="mt-2 text-gray-600">
          Logging you in...
        </p>
      </div>
    </div>
  );
}
