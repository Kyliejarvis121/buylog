import { PrismaClient } from "@prisma/client";

// Use a global variable to prevent multiple instances in development
const prisma = globalThis.prisma || new PrismaClient({
  log: ["query", "error", "warn"], // optional logging
});

// Only assign to globalThis in development
if (process.env.NODE_ENV !== "production") {
  globalThis.prisma = prisma;
}

export { prisma };
