"use client";

import React from "react";
import FormHeader from "@/components/backoffice/FormHeader";
import NewFarmerForm from "@/components/backoffice/farmer/NewFarmerForm"; // ✅ Corrected import path

export default function NewFarmerPage() {
  return (
    <div>
      <FormHeader title="New Farmer" />
      <NewFarmerForm />
    </div>
  );
}
