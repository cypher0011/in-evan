/**
 * Prisma Client Singleton
 * Prevents multiple instances in development (hot reload)
 */

import { PrismaClient } from '@prisma/client';

const prismaClientSingleton = () => {
  return new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
    // Disable prepared statements in development to avoid hot reload issues
    ...(process.env.NODE_ENV === 'development' && {
      datasources: {
        db: {
          url: process.env.DATABASE_URL + '?pgbouncer=true',
        },
      },
    }),
  });
};

declare const globalThis: {
  prismaGlobal: ReturnType<typeof prismaClientSingleton>;
} & typeof global;

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

export default prisma;

if (process.env.NODE_ENV !== 'production') {
  globalThis.prismaGlobal = prisma;
}
