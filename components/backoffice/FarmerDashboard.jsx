import FarmerDashboard from "@/components/backoffice/FarmerDashboard";
import { prisma } from "@/lib/prismadb";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { redirect } from "next/navigation";

export default async function FarmerDashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  // 🔹 Get farmer linked to logged-in user
  const farmer = await prisma.farmer.findFirst({
    where: {
      userId: session.user.id,
    },
    select: {
      id: true,
    },
  });

  if (!farmer) {
    console.error("❌ Farmer not found for user:", session.user.id);
    redirect("/dashboard");
  }

  // 🔹 Fetch farmer products
  const products = await prisma.product.findMany({
    where: {
      farmerId: farmer.id,
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      category: true,
    },
  });

  // 🔹 Fetch farmer sales
  const sales = await prisma.sale.findMany({
    where: {
      farmerId: farmer.id,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <FarmerDashboard
      products={products}
      sales={sales}
      supports={[]}
    />
  );
}
