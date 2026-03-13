"use client";
import { useSearchParams } from "next/navigation";
import RegisterForm from "@/components/frontend/RegisterForm";

export default function Page() {
  const params = useSearchParams();
  const plan = params.get("plan");

  return (
    <section>
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen">
        <div className="w-full bg-white rounded-lg shadow-2xl sm:max-w-md xl:p-0 dark:bg-gray-800">
          <div className="p-6 space-y-4 sm:p-8">
            <h1 className="text-xl font-bold text-center text-gray-900 dark:text-white">
              Create a Farmer Account
            </h1>

            {/* Manual farmer registration ONLY */}
            <RegisterForm role="FARMER" plan={plan} />
          </div>
        </div>
      </div>
    </section>
  );
}

