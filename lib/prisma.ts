/**
 * Prisma Client Singleton
 * Optimized for serverless with connection pooling
 */

import { PrismaClient } from '@prisma/client';

const prismaClientSingleton = () => {
  return new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
    // Connection pooling configuration for serverless environments
    // Supabase pooler requires pgbouncer=true flag for Prisma
    datasources: {
      db: {
        url: process.env.DATABASE_URL?.includes('pooler.supabase.com')
          ? process.env.DATABASE_URL + '?pgbouncer=true&connection_limit=1'
          : process.env.DATABASE_URL,
      },
    },
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
