import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import { getModBySlug } from "@/lib/data-access";
import Mod from "@/models/Mod";
import ModFile from "@/models/ModFile";

const FILE_URL_RE = /^https?:\/\//i;
const MEDIAFIRE_RE = /mediafire\.com/i;

export async function GET(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const mod = await getModBySlug(slug);
  if (!mod) {
    return NextResponse.json({ error: "Mod not found." }, { status: 404 });
  }
  return NextResponse.json({ mod });
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }
  const { slug } = await params;

  const mod = await Mod.findOne({ slug });
  if (!mod) return NextResponse.json({ error: "Mod not found." }, { status: 404 });
  if (String(mod.creator) !== session.user.id) {
    return NextResponse.json({ error: "You can only delete your own mods." }, { status: 403 });
  }

  await ModFile.deleteMany({ mod: mod._id });
  await Mod.deleteOne({ _id: mod._id });

  return NextResponse.json({ ok: true });
}

export async function PATCH(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }
  const { slug } = await params;
  const body = await request.json();

  const mod = await Mod.findOne({ slug });
  if (!mod) return NextResponse.json({ error: "Mod not found." }, { status: 404 });
  if (String(mod.creator) !== session.user.id) {
    return NextResponse.json({ error: "You can only edit your own mods." }, { status: 403 });
  }

  const updatable = ["title", "summary", "description", "subcategory", "tags", "gameVersion", "thumbnailUrl"];
  for (const key of updatable) {
    if (body[key] !== undefined) (mod as any)[key] = body[key];
  }

  if (body.fileUrl !== undefined) {
    const url = typeof body.fileUrl === "string" ? body.fileUrl.trim() : "";
    if (!url) {
      return NextResponse.json({ error: "Please enter a MediaFire link." }, { status: 400 });
    }
    if (!FILE_URL_RE.test(url) || !MEDIAFIRE_RE.test(url)) {
      return NextResponse.json({ error: "Please enter a valid MediaFire link." }, { status: 400 });
    }

    const conn = await connectDB();
    if (!conn) {
      return NextResponse.json({ error: "Database not configured." }, { status: 503 });
    }

    const file = await ModFile.findOne({ mod: mod._id });
    if (file) {
      file.url = url;
      await file.save();
    } else {
      await ModFile.create({
        mod: mod._id,
        version: "1.0",
        gameVersion: "Any",
        key: "",
        url,
        sizeBytes: 0,
      });
    }
  }

  await mod.save();

  return NextResponse.json({ ok: true });
}