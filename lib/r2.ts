import { S3Client } from "@aws-sdk/client-s3";

export const r2Bucket = () => process.env.R2_BUCKET ?? null;
export const r2PublicUrl = () => process.env.R2_PUBLIC_URL ?? null;

let client: S3Client | null = null;

export function getR2Client(): S3Client | null {
  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
  const accessKeyId = process.env.R2_ACCESS_KEY_ID;
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;

  if (!accountId || !accessKeyId || !secretAccessKey) return null;

  if (!client) {
    client = new S3Client({
      region: "auto",
      endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
    });
  }
  return client;
}

export function publicFileUrl(key: string): string {
  const base = r2PublicUrl();
  if (base) return `${base.replace(/\/$/, "")}/${key}`;
  return "";
}

export function isR2Configured(): boolean {
  return (
    !!process.env.CLOUDFLARE_ACCOUNT_ID &&
    !!process.env.R2_ACCESS_KEY_ID &&
    !!process.env.R2_SECRET_ACCESS_KEY &&
    !!process.env.R2_BUCKET
  );
}