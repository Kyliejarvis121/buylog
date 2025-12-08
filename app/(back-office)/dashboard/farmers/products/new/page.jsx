import ProductUpload from "@/components/backoffice/Farmer/ProductUpload";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

export default async function NewProductPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return <p className="p-6 text-red-600">Please login to upload a product</p>;
  }

  const userId = session.user.id;

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-semibold mb-6">Upload New Product</h1>
      <ProductUpload farmerId={userId} />
    </div>
  );
}
