"use client";

import React from "react";
import FormHeader from "@/components/backoffice/FormHeader";
import NewFarmerForm from "@/components/backoffice/NewFarmerForm";

export default function NewFarmerPage() {
  return (
    <div className="w-full">
      <FormHeader title="New Farmer" />
      <div className="mt-6">
        <NewFarmerForm />
      </div>
    </div>
  );
}
