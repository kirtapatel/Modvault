import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Mod from "@/models/Mod";
import ModFile from "@/models/ModFile";

export async function POST(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  try {
    const conn = await connectDB();
    if (!conn) {
      return NextResponse.json({ ok: true, demo: true }, { status: 200 });
    }

    const mod = await Mod.findOne({ slug });
    if (!mod) return NextResponse.json({ error: "Mod not found." }, { status: 404 });

    mod.downloads = (mod.downloads || 0) + 1;
    await mod.save();

    return NextResponse.json({ ok: true, downloads: mod.downloads });
  } catch (error) {
    console.error("Download tracking error:", error);
    return NextResponse.json({ ok: true, demo: true });
  }
}