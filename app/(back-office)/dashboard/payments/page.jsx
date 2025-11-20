import { getData } from "@/lib/getData";
import { Payment, columns } from "./columns";
import { DataTable } from "./data-table";

export default async function DemoPage() {
  const { success, data, error } = await getData("categories");

  if (!success) {
    return (
      <div className="container mx-auto py-10 text-red-600">
        Error fetching categories: {error}
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={data} />
    </div>
  );
}
