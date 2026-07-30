import { PrismaClient } from "@prisma/client";

/**
 * A single PrismaClient per process. Next.js dev reloads modules on every
 * change, so we stash the client on globalThis to avoid exhausting the
 * connection pool.
 */
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log:
      process.env.NODE_ENV === "development"
        ? ["warn", "error"]
        : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
