import { getData } from "@/lib/getData";
import { DataTable } from "./data-table";
import { columns } from "./columns";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function DemoPage() {
  const { success, data: categories, error } = await getData("categories");

  if (!success) {
    return (
      <div className="container mx-auto py-10 text-red-600">
        Failed to fetch categories: {error}
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={categories} />
    </div>
  );
}
