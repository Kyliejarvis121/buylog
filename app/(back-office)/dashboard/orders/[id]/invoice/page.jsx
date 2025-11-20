import { prisma } from "@/lib/prismadb";
import SalesInvoice from "@/components/Order/SalesInvoice";

export default async function SalesInvoicePage({ params: { id } }) {
  let order = null;

  try {
    order = await prisma.orders.findUnique({
      where: { id },
      include: {
        items: true, // include related items if needed
      },
    });
  } catch (error) {
    return (
      <div className="text-red-600 p-4">
        Failed to fetch order: {error.message}
      </div>
    );
  }

  if (!order) {
    return <p className="p-4">Order not found.</p>;
  }

  return <SalesInvoice order={order} />;
}
