import { prisma } from "@/lib/prismadb";

// GET /api/farmers
export async function GET(request) {
  try {
    const farmers = await prisma.farmer.findMany({
      where: {
        userId: { not: null }, // skip orphan rows
      },
      include: {
        user: {
          include: {
            orders: true,
          },
        },
        products: true,
      },
    });

    return new Response(JSON.stringify(farmers), { status: 200 });
  } catch (error) {
    console.error("Error fetching farmers:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500 }
    );
  }
}