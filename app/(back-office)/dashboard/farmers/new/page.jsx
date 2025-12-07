"use client";

import React from "react";
import FormHeader from "@/components/backoffice/FormHeader";
import NewFarmerForm from "@/components/farmer/NewFarmerForm";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { redirect } from "next/navigation";

export default async function NewFarmer() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login"); // redirect if not logged in
  }

  return (
    <div>
      <FormHeader title="New Farmer" />
      <NewFarmerForm user={session.user} />
    </div>
  );
}
