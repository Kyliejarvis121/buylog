import { prisma } from "../lib/prismadb";

async function main() {
  try {
    console.log("Linking old farmers to admin user...");

    // 👉 Replace with the REAL admin user ID
    const adminUserId = "PUT_ADMIN_USER_ID_HERE";

    // 1. Fetch all farmers that have NO user assigned
    const farmers = await prisma.farmer.findMany({
      where: { userId: null },
    });

    if (farmers.length === 0) {
      console.log("No farmers found without userId. Nothing to update.");
      return;
    }

    // 2. Update all of them
    for (const farmer of farmers) {
      await prisma.farmer.update({
        where: { id: farmer.id },
        data: { userId: adminUserId },
      });
      console.log(`Linked farmer ${farmer.name} → admin user`);
    }

    console.log("✅ All farmers updated successfully!");
  } catch (error) {
    console.error("❌ ERROR:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
