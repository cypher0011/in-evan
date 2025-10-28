import { S3Client } from "@aws-sdk/client-s3";
import { fromEnv } from "@aws-sdk/credential-providers";

export const s3 = new S3Client({
  region: process.env.AWS_REGION ?? process.env.BUCKET_REGION!,
  credentials: fromEnv(),
});
