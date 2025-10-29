import { S3Client } from "@aws-sdk/client-s3";

export const s3 = new S3Client({
  region: process.env.MY_AWS_REGION ?? process.env.BUCKET_REGION ?? "eu-north-1",
  credentials: {
    accessKeyId: process.env.MY_AWS_ACCESS_KEY!,
    secretAccessKey: process.env.MY_AWS_SECRET_ACCESS_KEY!,
  },
});