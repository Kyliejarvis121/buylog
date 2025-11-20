import { prisma } from "@/lib/prismadb";
import { DataTable } from "./data-table";
import { columns } from "./columns";

export default async function DemoPage() {
  let categories = [];

  try {
    categories = await prisma.categories.findMany({
      orderBy: { createdAt: "desc" },
    });
  } catch (error) {
    return (
      <div className="container mx-auto py-10 text-red-600">
        Error fetching categories: {error.message}
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={categories} />
    </div>
  );
}
