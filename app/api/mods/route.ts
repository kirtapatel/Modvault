import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import { listMods } from "@/lib/data-access";
import { slugify } from "@/lib/utils";
import Mod from "@/models/Mod";
import ModFile from "@/models/ModFile";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const gameSlug = searchParams.get("game") ?? undefined;
  const subcategory = searchParams.get("subcategory") ?? undefined;
  const search = searchParams.get("q") ?? undefined;
  const tag = searchParams.get("tag") ?? undefined;
  const sort = (searchParams.get("sort") as "newest" | "popular" | "rated") ?? "newest";
  const limit = Number(searchParams.get("limit") ?? "24");

  try {
    const mods = await listMods({ gameSlug, subcategory, search, tag, sort, limit });
    return NextResponse.json({ mods });
  } catch (error) {
    console.error("List mods error:", error);
    return NextResponse.json({ mods: await listMods({ gameSlug, subcategory, search, tag, sort, limit }) });
  }
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "You must be signed in to upload." }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { title, summary, description, game, gameSlug, subcategory, tags, files, thumbnailUrl } = body;

    if (!title || !summary || !description || !game || !gameSlug || !subcategory) {
      return NextResponse.json(
        { error: "Title, summary, description, game and category are required." },
        { status: 400 }
      );
    }

    const conn = await connectDB();
    if (!conn) {
      return NextResponse.json({ error: "Database not configured." }, { status: 503 });
    }

    let slug = slugify(title);
    const existing = await Mod.findOne({ slug });
    if (existing) {
      slug = `${slug}-${Date.now().toString(36)}`;
    }

    const mod = await Mod.create({
      title,
      slug,
      summary,
      description,
      creator: session.user.id,
      game,
      gameSlug,
      subcategory,
      thumbnailUrl: thumbnailUrl || "",
      tags: Array.isArray(tags) ? tags : [],
      virusChecked: process.env.VIRUS_CHECK_ENABLED !== "false",
    });

    const fileDocs = Array.isArray(files) ? files : [];
    for (const f of fileDocs) {
      await ModFile.create({
        mod: mod._id,
        version: f.version || "1.0",
        gameVersion: f.gameVersion || "Any",
        key: f.key || "",
        url: f.url || "",
        sizeBytes: f.sizeBytes || 0,
      });
    }

    return NextResponse.json({ ok: true, mod: { id: String(mod._id), slug } }, { status: 201 });
  } catch (error) {
    console.error("Create mod error:", error);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}