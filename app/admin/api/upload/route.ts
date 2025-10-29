import { NextResponse } from "next/server";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { s3 } from "@/lib/s3";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  return NextResponse.json({ ok: true, route: "/admin/api/upload" });
}

export async function POST(req: Request) {
  if (!process.env.BUCKET_NAME) {
    return NextResponse.json({ error: "Missing BUCKET_NAME" }, { status: 500 });
  }

  const region = process.env.AWS_REGIO ?? process.env.BUCKET_REGION ?? "eu-north-1";

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    if (!file) return NextResponse.json({ error: "No file provided" }, { status: 400 });

    const bytes = Buffer.from(await file.arrayBuffer());
    const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
    const key = `uploads/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

    // Upload to S3 (bucket policy will control public access)
    await s3.send(
      new PutObjectCommand({
        Bucket: process.env.BUCKET_NAME!,
        Key: key,
        Body: bytes,
        ContentType: file.type || "application/octet-stream",
        CacheControl: "public, max-age=31536000, immutable",
      })
    );

    // Return permanent public URL (no expiration)
    // Use the regional endpoint format: https://s3.region.amazonaws.com/bucket/key
    const publicUrl = `https://s3.${region}.amazonaws.com/${process.env.BUCKET_NAME}/${key}`;

    console.log("Upload successful:", { publicUrl, key });

    return NextResponse.json({ url: publicUrl, key });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Upload failed" }, { status: 500 });
  }
}
