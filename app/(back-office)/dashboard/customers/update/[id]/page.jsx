import CustomerForm from "@/components/backoffice/CustomerForm";
import FormHeader from "@/components/backoffice/FormHeader";
import DeleteBtn from "@/components/Actions/DeleteBtn";
import { getData } from "@/lib/getData";
import React from "react";

export default async function UpdateCustomer({ params: { id } }) {
  const { success, data: user, error } = await getData(`users/${id}`);

  if (!success || !user) {
    return (
      <div className="p-4 text-red-600">
        Failed to load customer: {error}
      </div>
    );
  }

  return (
    <div>
      <FormHeader title="Update Customer" />

      {/* CUSTOMER FORM */}
      <CustomerForm user={user} />

      {/* DELETE BUTTON */}
      <div className="mt-6">
        <DeleteBtn
          id={user.id}
          title="Customer"
          type="customer"
        />
      </div>
    </div>
  );
}