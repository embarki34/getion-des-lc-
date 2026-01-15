import { PrismaClient } from '../src/identity/infrastructure/persistence/prisma/client';

/**
 * PrismaClient is attached to the `global` object in development to prevent
 * exhausting your database connection limit.
 *
 * Learn more:
 * https://pris.ly/d/help/next-js-best-practices
 */

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    errorFormat: 'pretty',
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

/**
 * Gracefully disconnect Prisma on application shutdown
 */
export const disconnectPrisma = async (): Promise<void> => {
  await prisma.$disconnect();
};

/**
 * Connect to the database
 */
export const connectPrisma = async (): Promise<void> => {
  await prisma.$connect();
};

export default prisma;
