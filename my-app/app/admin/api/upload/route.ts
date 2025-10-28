import { NextResponse } from "next/server";
import { PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { s3 } from "@/lib/s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  return NextResponse.json({ ok: true, route: "/admin/api/upload" });
}

export async function POST(req: Request) {
  if (!process.env.BUCKET_NAME) {
    return NextResponse.json({ error: "Missing BUCKET_NAME" }, { status: 500 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    if (!file) return NextResponse.json({ error: "No file provided" }, { status: 400 });

    const bytes = Buffer.from(await file.arrayBuffer());
    const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
    const key = `uploads/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

    // ⬇️ NO ACL here
    await s3.send(
      new PutObjectCommand({
        Bucket: process.env.BUCKET_NAME!,
        Key: key,
        Body: bytes,
        ContentType: file.type || "application/octet-stream",
        CacheControl: "31536000",
      })
    );

    // Pre-signed (temporary) URL for reading the object
    const signedUrl = await getSignedUrl(
      s3,
      new GetObjectCommand({
        Bucket: process.env.BUCKET_NAME!,
        Key: key,
      }),
      { expiresIn: 60 * 60 } // 1 hour
    );

    return NextResponse.json({ url: signedUrl, key });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Upload failed" }, { status: 500 });
  }
}
