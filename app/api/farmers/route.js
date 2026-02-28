import { prisma } from "@/lib/prismadb";

export async function GET() {
  try {
    const farmers = await prisma.farmer.findMany({
      where: {
        userId: { not: null }, // only rows with userId
      },
      include: {
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

export const dynamic = "force-dynamic";
export const revalidate = 0;