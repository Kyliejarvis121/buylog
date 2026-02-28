import { prisma } from "@/lib/prismadb";

export async function GET() {
  try {
    const farmers = await prisma.farmer.findMany({
      include: {
        user: true, // but handle missing user
        products: true,
      },
    });

    // filter out broken records (user is null)
    const safeFarmers = farmers.filter((f) => f.user !== null);

    return new Response(JSON.stringify(safeFarmers), { status: 200 });
  } catch (error) {
    console.error("Error fetching farmers:", error);

    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500 }
    );
  }
}