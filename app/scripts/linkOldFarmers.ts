import { prisma } from "@/lib/prismadb";

async function main() {
  // Replace with your current logged-in admin user ID
  const adminUserId = "YOUR_ADMIN_USER_ID";

  // Find all Farmers without a userId
  const oldFarmers = await prisma.farmer.findMany({
    where: { userId: null },
  });

  console.log(`Found ${oldFarmers.length} farmers without userId.`);

  for (const farmer of oldFarmers) {
    await prisma.farmer.update({
      where: { id: farmer.id },
      data: { userId: adminUserId },
    });
    console.log(`Linked Farmer ${farmer.name} (${farmer.id}) to user ${adminUserId}`);
  }

  console.log("All old farmers have been linked.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
