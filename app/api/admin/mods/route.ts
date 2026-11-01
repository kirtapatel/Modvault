import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { isAdminSession } from "@/lib/admin";
import { connectDB } from "@/lib/mongodb";
import Mod from "@/models/Mod";
import ModFile from "@/models/ModFile";

export async function GET(request: Request) {
  const session = await auth();
  if (!(await isAdminSession(session))) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const page = Math.max(1, Number(searchParams.get("page") ?? "1"));
  const q = searchParams.get("q") ?? "";
  const perPage = 20;

  const conn = await connectDB();
  if (!conn) {
    return NextResponse.json({ mods: [], total: 0 });
  }

  try {
    const filter = q ? { title: { $regex: q, $options: "i" } } : {};
    const total = await Mod.countDocuments(filter);
    const docs = await Mod.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * perPage)
      .limit(perPage)
      .populate("creator", "name email")
      .lean();
    const fileDocs = await ModFile.find({ mod: { $in: docs.map((m) => m._id) } })
      .select("mod url")
      .lean();
    const fileByModId = new Map(fileDocs.map((file) => [String(file.mod), file.url || ""]));

    return NextResponse.json({
      mods: docs.map((m) => {
        const creator = m.creator as unknown as {
          name?: string;
          email?: string;
        } | null;

        return {
          id: String(m._id),
          title: m.title,
          slug: m.slug,
          game: m.game,
          gameSlug: m.gameSlug,
          subcategory: m.subcategory,
          downloads: m.downloads || 0,
          createdAt: (m.createdAt || new Date()).toISOString(),
          creatorName: creator?.name ?? "Unknown",
          creatorEmail: creator?.email ?? "",
          virusChecked: m.virusChecked !== false,
          mediaFireUrl: fileByModId.get(String(m._id)) ?? "",
        };
      }),
      total,
      page,
    });
  } catch (error) {
    console.error("Admin mods error:", error);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  const session = await auth();
  if (!(await isAdminSession(session))) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const { id, mediaFireUrl } = await request.json();
    const url = typeof mediaFireUrl === "string" ? mediaFireUrl.trim() : "";

    if (!id || !url) {
      return NextResponse.json({ error: "A mod id and MediaFire link are required." }, { status: 400 });
    }
    if (!/^https?:\/\//i.test(url) || !/mediafire\.com/i.test(url)) {
      return NextResponse.json({ error: "Please enter a valid MediaFire link." }, { status: 400 });
    }

    const conn = await connectDB();
    if (!conn) {
      return NextResponse.json({ error: "Database not configured." }, { status: 503 });
    }

    const mod = await Mod.findById(id);
    if (!mod) return NextResponse.json({ error: "Mod not found." }, { status: 404 });

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

    return NextResponse.json({ ok: true, mediaFireUrl: url });
  } catch (error) {
    console.error("Admin update mod link error:", error);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const session = await auth();
  if (!(await isAdminSession(session))) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const { id } = await request.json();
    if (!id) return NextResponse.json({ error: "Missing mod id." }, { status: 400 });

    const conn = await connectDB();
    if (!conn) {
      return NextResponse.json({ error: "Database not configured." }, { status: 503 });
    }

    const mod = await Mod.findById(id);
    if (!mod) return NextResponse.json({ error: "Mod not found." }, { status: 404 });

    await ModFile.deleteMany({ mod: mod._id });
    await Mod.deleteOne({ _id: mod._id });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Admin delete mod error:", error);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}