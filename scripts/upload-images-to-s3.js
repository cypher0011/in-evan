/**
 * Upload images to S3 bucket for optimized delivery
 * Run: node scripts/upload-images-to-s3.js
 */

const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const fs = require('fs');
const path = require('path');

// Load env vars
require('dotenv').config({ path: '.env.local' });

const s3Client = new S3Client({
  region: process.env.BUCKET_REGION || process.env.MY_AWS_REGION,
  credentials: {
    accessKeyId: process.env.MY_AWS_ACCESS_KEY,
    secretAccessKey: process.env.MY_AWS_SECRET_ACCESS_KEY,
  },
});

const BUCKET_NAME = process.env.BUCKET_NAME;

// Images to upload
const imagesToUpload = [
  { local: 'public/hotel_bg_test.jpeg', s3Key: 'hotel-images/hotel_bg_test.jpeg', contentType: 'image/jpeg' },
  { local: 'public/movenpick_logo.png', s3Key: 'hotel-images/movenpick_logo.png', contentType: 'image/png' },
  { local: 'public/normal_room.jpeg', s3Key: 'hotel-images/normal_room.jpeg', contentType: 'image/jpeg' },
  { local: 'public/delux_room.jpeg', s3Key: 'hotel-images/delux_room.jpeg', contentType: 'image/jpeg' },
  { local: 'public/bg.jpeg', s3Key: 'hotel-images/bg.jpeg', contentType: 'image/jpeg' },
  { local: 'public/care_item.jpeg', s3Key: 'hotel-images/care_item.jpeg', contentType: 'image/jpeg' },
  { local: 'public/flowers_item.jpeg', s3Key: 'hotel-images/flowers_item.jpeg', contentType: 'image/jpeg' },
  { local: 'public/pickfrom_airport.jpeg', s3Key: 'hotel-images/pickfrom_airport.jpeg', contentType: 'image/jpeg' },
];

async function uploadImage(localPath, s3Key, contentType) {
  try {
    const fileContent = fs.readFileSync(path.join(__dirname, '..', localPath));

    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: s3Key,
      Body: fileContent,
      ContentType: contentType,
      CacheControl: 'public, max-age=31536000, immutable', // Cache for 1 year
    });

    await s3Client.send(command);
    console.log(`✓ Uploaded: ${localPath} → s3://${BUCKET_NAME}/${s3Key}`);

    const s3Url = `https://${BUCKET_NAME}.s3.${process.env.BUCKET_REGION}.amazonaws.com/${s3Key}`;
    console.log(`  URL: ${s3Url}\n`);

    return s3Url;
  } catch (error) {
    console.error(`✗ Failed to upload ${localPath}:`, error.message);
    throw error;
  }
}

async function main() {
  console.log('Starting image upload to S3...\n');
  console.log(`Bucket: ${BUCKET_NAME}`);
  console.log(`Region: ${process.env.BUCKET_REGION}\n`);

  const results = [];

  for (const image of imagesToUpload) {
    try {
      const url = await uploadImage(image.local, image.s3Key, image.contentType);
      results.push({ ...image, url, success: true });
    } catch (error) {
      results.push({ ...image, success: false, error: error.message });
    }
  }

  console.log('\n=== UPLOAD SUMMARY ===\n');

  const successful = results.filter(r => r.success);
  const failed = results.filter(r => !r.success);

  console.log(`✓ Successful: ${successful.length}`);
  console.log(`✗ Failed: ${failed.length}\n`);

  if (successful.length > 0) {
    console.log('Now add these URLs to your Next.js config:\n');
    console.log('next.config.ts → images.remotePatterns:');
    console.log(`{
  protocol: 'https',
  hostname: '${BUCKET_NAME}.s3.${process.env.BUCKET_REGION}.amazonaws.com',
  pathname: '/hotel-images/**',
},\n`);
  }

  if (failed.length > 0) {
    console.log('Failed uploads:');
    failed.forEach(f => console.log(`  - ${f.local}: ${f.error}`));
    process.exit(1);
  }
}

main().catch(console.error);
