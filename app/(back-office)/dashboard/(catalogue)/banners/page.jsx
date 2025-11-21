export default async function BannersPage() {
  let banners = [];

  try {
    banners = await prisma.banners.findMany({
      orderBy: { createdAt: "desc" }, // Ensure `createdAt` exists in your model
    });
  } catch (error) {
    return (
      <div className="p-4 text-red-600">
        Failed to fetch banners: {error?.message || "Unknown error"}
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        heading="Banners"
        href="/dashboard/banners/new"
        linkTitle="Add Banner"
      />
      <div className="py-8">
        {banners.length === 0 ? (
          <p>No banners available.</p>
        ) : (
          <DataTable data={banners} columns={columns} />
        )}
      </div>
    </div>
  );
}
