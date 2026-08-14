import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "You must be signed in to upload photos." }, { status: 401 });
  }

  const key = process.env.IMGBB_API_KEY;
  if (!key) {
    return NextResponse.json(
      { error: "IMGBB_API_KEY is not configured. Add it to .env.local to enable photo uploads." },
      { status: 500 }
    );
  }

  let body: { image?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const image = typeof body.image === "string" ? body.image.trim() : "";
  if (!image) {
    return NextResponse.json({ error: "No image provided." }, { status: 400 });
  }

  try {
    const form = new URLSearchParams();
    form.set("key", key);
    form.set("image", image);

    const res = await fetch("https://api.imgbb.com/1/upload", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: form.toString(),
    });
    const data = await res.json().catch(() => ({}));

    if (!res.ok || !data?.data?.url) {
      console.error("imgbb upload failed:", data?.error?.message ?? res.status);
      return NextResponse.json({ error: "Image upload to imgbb failed. Please try again." }, { status: 502 });
    }

    return NextResponse.json({ url: data.data.url });
  } catch (error) {
    console.error("imgbb upload error:", error);
    return NextResponse.json({ error: "Something went wrong uploading the image." }, { status: 500 });
  }
}