import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import { isAdminEmail } from "@/lib/admin";
import Mod from "@/models/Mod";
import ModFile from "@/models/ModFile";
import User from "@/models/User";
import type { Mod as ModType } from "@/lib/types";
import type { LeanMod, LeanModFile } from "@/lib/mongo-types";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  const admin = await isAdminEmail(session.user.email);

  try {
    const conn = await connectDB();
    if (!conn) {
      return NextResponse.json({ favoriteMods: [], uploadedMods: [], demo: true, admin });
    }

    const [user, uploadedDocsRaw, favoriteDocsRaw] = await Promise.all([
      User.findById(session.user.id),
      Mod.find({ creator: session.user.id }).sort({ createdAt: -1 }).lean().exec(),
      Mod.find({ _id: { $in: (await User.findById(session.user.id).lean())?.favorites || [] } })
        .sort({ createdAt: -1 })
        .lean()
        .exec(),
    ]);

    const uploadedDocs = uploadedDocsRaw as unknown as LeanMod[];
    const favoriteDocs = favoriteDocsRaw as unknown as LeanMod[];

    const toMod = (doc: LeanMod, files: ModType["files"]): ModType => ({
      id: String(doc._id),
      slug: doc.slug,
      title: doc.title,
      summary: doc.summary,
      description: doc.description,
      creator: { id: String(user?._id ?? ""), name: user?.name ?? "", avatar: user?.avatar || null, bio: user?.bio ?? "", koFi: user?.koFi || null, patreon: user?.patreon || null },
      game: doc.game,
      gameSlug: doc.gameSlug,
      subcategory: doc.subcategory,
      thumbnailUrl: doc.thumbnailUrl || null,
      tags: doc.tags || [],
      downloads: doc.downloads || 0,
      rating: doc.ratingValue && doc.ratingCount ? doc.ratingValue / doc.ratingCount : 0,
      ratingCount: doc.ratingCount || 0,
      virusChecked: doc.virusChecked !== false,
      createdAt: new Date(doc.createdAt || Date.now()).toISOString(),
      files,
      screenshots: doc.screenshots || [],
    });

    const uploadedMods: ModType[] = [];
    for (const doc of uploadedDocs) {
      const files = (await ModFile.find({ mod: doc._id }).lean().exec()) as unknown as LeanModFile[];
      uploadedMods.push(toMod(doc, files.map((f) => ({ id: String(f._id), version: f.version, gameVersion: f.gameVersion, url: f.url || f.key, sizeBytes: f.sizeBytes || 0 }))));
    }

    const favoriteMods: ModType[] = favoriteDocs.map((doc) => toMod(doc, []));

    return NextResponse.json({
      user: user
        ? {
            id: String(user._id),
            name: user.name,
            email: user.email,
            avatar: user.avatar || null,
            bio: user.bio || "",
            isPremium: user.isPremium,
            koFi: user.koFi || "",
            patreon: user.patreon || "",
          }
        : null,
      favoriteMods,
      uploadedMods,
      admin,
    });
  } catch (error) {
    console.error("Dashboard error:", error);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}