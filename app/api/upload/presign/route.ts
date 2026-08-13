import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getR2Client, r2Bucket, publicFileUrl, isR2Configured } from "@/lib/r2";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { slugify } from "@/lib/utils";

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "You must be signed in to upload." }, { status: 401 });
  }

  try {
    const { filename, contentType, modSlug } = await request.json();
    if (!filename) {
      return NextResponse.json({ error: "Missing filename." }, { status: 400 });
    }

    if (!isR2Configured()) {
      return NextResponse.json(
        {
          error:
            "Cloudflare R2 is not configured. Add CLOUDFLARE_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY and R2_BUCKET to .env.local",
        },
        { status: 503 }
      );
    }

    const client = getR2Client();
    if (!client) {
      return NextResponse.json({ error: "R2 client unavailable." }, { status: 503 });
    }

    const safeName = slugify(filename.replace(/\.[^/.]+$/, ""));
    const ext = filename.split(".").pop() || "bin";
    const key = `mods/${modSlug || "draft"}/${session.user.id}/${Date.now()}-${safeName}.${ext}`;

    const command = new PutObjectCommand({
      Bucket: r2Bucket()!,
      Key: key,
      ContentType: contentType || "application/octet-stream",
    });

    const uploadUrl = await getSignedUrl(client, command, { expiresIn: 60 * 30 });

    return NextResponse.json({
      uploadUrl,
      key,
      publicUrl: publicFileUrl(key),
    });
  } catch (error) {
    console.error("Presign error:", error);
    return NextResponse.json({ error: "Failed to create upload link." }, { status: 500 });
  }
}