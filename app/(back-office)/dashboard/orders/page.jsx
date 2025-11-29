export const dynamic = "force-dynamic";
export const revalidate = 0;

import { authOptions } from "@/lib/authOptions";
import { getServerSession } from "next-auth";
import OrderCard from "@/components/Order/OrderCard";
import { getData } from "@/lib/getData";

export default async function OrdersPage() {
  const session = await getServerSession(authOptions);
  if (!session) return <p>Please log in to see your orders.</p>;

  const userId = session.user.id;

  const { success, data: orders, error } = await getData(`orders?userId=${userId}`);

  if (!success) {
    return <p className="text-red-600">Failed to fetch orders: {error}</p>;
  }

  if (!orders || orders.length === 0) {
    return <p>No Orders Yet</p>;
  }

  return (
    <section className="py-12 bg-white sm:py-16 lg:py-20">
      <div className="px-4 m-auto sm:px-6 lg:px-8 max-w-7xl">
        <div className="max-w-6xl mx-auto">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
              Your Orders
            </h1>
            <p className="mt-2 text-sm font-normal text-gray-600">
              Check the status of recent and old orders & discover more products
            </p>
          </div>

          <ul className="mt-8 space-y-5 lg:mt-12 sm:space-y-6 lg:space-y-10">
            {orders.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
