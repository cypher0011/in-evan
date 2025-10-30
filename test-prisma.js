// test-prisma.js
require('dotenv').config({ path: '.env.local' });
const { PrismaClient } = require('@prisma/client');
const url = require('url');

function ensureSsl(connectionString) {
  if (!connectionString) return connectionString;
  // If already has querystring, keep it, otherwise add sslmode=require
  try {
    const parsed = new URL(connectionString);
    // For postgres-style connection strings that start with "postgresql://" or "postgres://"
    // set search param sslmode=require if not present
    if (!parsed.searchParams.has('sslmode')) {
      parsed.searchParams.set('sslmode', 'require');
      return parsed.toString();
    }
    return connectionString;
  } catch (e) {
    // Fallback: naive append if we can't parse as URL
    if (connectionString.includes('?')) {
      if (!/sslmode=/.test(connectionString)) return connectionString + '&sslmode=require';
      return connectionString;
    } else {
      return connectionString + '?sslmode=require';
    }
  }
}

// Choose direct connection for testing if available
if (process.env.DIRECT_URL && process.env.DIRECT_URL.length > 0) {
  process.env.DATABASE_URL = ensureSsl(process.env.DIRECT_URL);
  console.log('Using DIRECT_URL for this test (will bypass pooler).');
} else if (process.env.DATABASE_URL) {
  process.env.DATABASE_URL = ensureSsl(process.env.DATABASE_URL);
  console.log('Using DATABASE_URL (pooler) for this test.');
} else {
  console.warn('No DATABASE_URL or DIRECT_URL found in .env.local — test will fail until you set one.');
}

// Mask function for logging
function maskConnString(s) {
  if (!s) return '(empty)';
  // remove password portion: postgresql://user:pass@host...
  return s.replace(/:\/\/([^:]+):([^@]+)@/, '://$1:*****@');
}

// Optional: log a masked connection string for debugging
console.log('DB connection (masked):', maskConnString(process.env.DATABASE_URL || process.env.DIRECT_URL || ''));

const prisma = new PrismaClient({
  log: ['query', 'warn', 'error'],
  // Optionally you can override datasource programmatically:
  // datasources: { db: { url: process.env.DATABASE_URL } }
});

async function testConnection() {
  try {
    console.log('Testing Prisma connection...');

    // Test 1: Count hotels
    const hotelCount = await prisma.hotel.count();
    console.log(`✅ Found ${hotelCount} hotels in database`);

    // Test 2: Find movenpick
    const movenpick = await prisma.hotel.findUnique({
      where: { subdomain: 'movenpick' },
    });
    console.log('✅ Movenpick hotel:', movenpick);

    // Test 3: Find all active hotels
    const activeHotels = await prisma.hotel.findMany({
      where: { status: 'active' },
    });
    console.log(`✅ Active hotels: ${activeHotels.length}`);
    activeHotels.forEach(h => console.log(`  - ${h.subdomain}: ${h.name}`));

    // Test 4: Check if TEST12345 token exists
    if (movenpick) {
      const token = await prisma.guestToken.findUnique({
        where: { token: 'TEST12345' },
        include: {
          guest: true,
          bookings: {
            where: { hotelId: movenpick.id },
            orderBy: { createdAt: 'desc' },
            take: 1,
          },
        },
      });

      if (token) {
        console.log('\n✅ Token TEST12345 found:');
        console.log(`   Guest: ${token.guest?.firstName} ${token.guest?.lastName}`);
        console.log(`   Status: ${token.status}`);
        console.log(`   Expires: ${token.expiresAt}`);
        if (token.bookings[0]) {
          console.log(`   Room: ${token.bookings[0].roomNumber}`);
          console.log(`   Check-in: ${token.bookings[0].checkInDate}`);
          console.log(`   Check-out: ${token.bookings[0].checkOutDate}`);
        }
      } else {
        console.log('\n❌ Token TEST12345 not found in database');
        console.log('   Create it in Supabase to test the welcome page');
      }
    }

  } catch (error) {
    console.error('❌ Error (message):', error.message);
    console.error('Full error object:', error);

    // Extra hints based on the common Supabase/pooler errors
    if (/Tenant or user not found|authentication failed|role ".*" does not exist/i.test(error.message)) {
      console.error('\nHints:');
      console.error('- Are you using the DIRECT_URL for migrations & direct operations? (set DIRECT_URL in .env.local)');
      console.error('- Confirm the username/password are correct in Supabase -> Database -> Connection info.');
      console.error('- Try connecting with psql to the same DIRECT_URL to verify credentials (see README below).');
      console.error('- Make sure sslmode=require is present on the connection string.');
    }
  } finally {
    await prisma.$disconnect();
  }
}

testConnection();
