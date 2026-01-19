// app/api/farmers/route.js
import { prisma } from "@/lib/prismadb";

// GET /api/farmers
export async function GET(request) {
  try {
    // Fetch all farmers with related user info and products
    const farmers = await prisma.farmer.findMany({
      include: {
        user: {
          include: {
            orders: true, // orders are on the User model
          },
        },
        products: true, // include products for each farmer
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

// You can still add POST, PUT, DELETE here if needed later
