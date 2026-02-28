import { prisma } from "@/lib/prismadb";

// GET /api/farmers
export async function GET() {
  try {
    const farmers = await prisma.farmer.findMany({
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