import { connectDB } from "@/lib/mongodb";
import Mod from "@/models/Mod";
import ModFile from "@/models/ModFile";
import User from "@/models/User";
import { demoMods } from "@/lib/demo-data";
import type { Creator, Mod as ModType, ModFile as ModFileType } from "@/lib/types";
import type { LeanMod, LeanModFile, LeanUserPublic } from "@/lib/mongo-types";
import { GAMES } from "@/lib/types";

function toFile(doc: LeanModFile): ModFileType {
  return {
    id: String(doc._id),
    version: doc.version,
    gameVersion: doc.gameVersion,
    url: doc.url || doc.key,
    sizeBytes: doc.sizeBytes || 0,
  };
}

function toCreator(doc: LeanUserPublic): Creator {
  return {
    id: String(doc._id),
    name: doc.name || "Creator",
    avatar: doc.avatar || null,
    bio: doc.bio || "",
    koFi: doc.koFi || null,
    patreon: doc.patreon || null,
  };
}

function toMod(doc: LeanMod, files: LeanModFile[] = []): ModType {
  return {
    id: String(doc._id),
    slug: doc.slug,
    title: doc.title,
    summary: doc.summary,
    description: doc.description,
    creator: doc.creator ? toCreator(doc.creator) : { id: "unknown", name: "Unknown", avatar: null, bio: "", koFi: null, patreon: null },
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
    files: files.map(toFile),
    screenshots: doc.screenshots || [],
  };
}

export async function listMods({
  gameSlug,
  subcategory,
  sort = "newest",
  search,
  tag,
  limit = 24,
}: {
  gameSlug?: string;
  subcategory?: string;
  sort?: "newest" | "popular" | "rated";
  search?: string;
  tag?: string;
  limit?: number;
} = {}): Promise<ModType[]> {
  const conn = await connectDB();
  if (!conn) {
    let out = [...demoMods];
    if (gameSlug) out = out.filter((m) => m.gameSlug === gameSlug);
    if (subcategory) out = out.filter((m) => m.subcategory === subcategory);
    if (tag) out = out.filter((m) => m.tags.includes(tag));
    if (search) out = out.filter((m) => (m.title + m.summary + m.tags.join(" ")).toLowerCase().includes(search.toLowerCase()));
    out.sort((a, b) =>
      sort === "popular"
        ? b.downloads - a.downloads
        : sort === "rated"
          ? b.rating - a.rating
          : +new Date(b.createdAt) - +new Date(a.createdAt)
    );
    return out.slice(0, limit);
  }

  const filter: {
    gameSlug?: string;
    subcategory?: string;
    tags?: string;
  } = {};
  if (gameSlug) filter.gameSlug = gameSlug;
  if (subcategory) filter.subcategory = subcategory;
  if (tag) filter.tags = tag;

  let q = Mod.find(filter);
  switch (sort) {
    case "popular":
      q = q.sort({ downloads: -1 });
      break;
    case "rated":
      q = q.sort({ ratingValue: -1, ratingCount: -1 });
      break;
    default:
      q = q.sort({ createdAt: -1 });
  }
  const docs = await q.limit(limit).lean();
  const mods: ModType[] = [];

  for (const doc of docs) {
    const [creator, files] = await Promise.all([
      User.findById(doc.creator).select("name avatar bio koFi patreon").lean(),
      ModFile.find({ mod: doc._id }).lean(),
    ]);
    mods.push(toMod({ ...doc, creator }, files));
  }

  if (mods.length < limit) {
    let demo = [...demoMods];
    if (gameSlug) demo = demo.filter((m) => m.gameSlug === gameSlug);
    if (subcategory) demo = demo.filter((m) => m.subcategory === subcategory);
    if (tag) demo = demo.filter((m) => m.tags.includes(tag));
    if (search) demo = demo.filter((m) => (m.title + m.summary + m.tags.join(" ")).toLowerCase().includes(search.toLowerCase()));
    demo.sort((a, b) =>
      sort === "popular"
        ? b.downloads - a.downloads
        : sort === "rated"
          ? b.rating - a.rating
          : +new Date(b.createdAt) - +new Date(a.createdAt)
    );
    const existing = new Set(mods.map((m) => m.slug));
    for (const dm of demo) {
      if (mods.length >= limit) break;
      if (!existing.has(dm.slug)) {
        mods.push(dm);
        existing.add(dm.slug);
      }
    }
  }

  return mods;
}

export async function getModBySlug(slug: string): Promise<ModType | null> {
  const conn = await connectDB();
  if (!conn) {
    return demoMods.find((m) => m.slug === slug) ?? null;
  }
  const doc = await Mod.findOne({ slug }).lean();
  if (!doc) {
    return demoMods.find((m) => m.slug === slug) ?? null;
  }
  const [creator, files] = await Promise.all([
    User.findById(doc.creator).select("name avatar bio koFi patreon").lean(),
    ModFile.find({ mod: doc._id }).lean(),
  ]);
  return toMod({ ...doc, creator }, files);
}

export async function getModById(id: string): Promise<ModType | null> {
  const conn = await connectDB();
  if (!conn || !/^[a-f\d]{24}$/i.test(id)) {
    return demoMods.find((m) => m.id === id) ?? null;
  }
  const doc = await Mod.findById(id).lean();
  if (!doc) return null;
  const [creator, files] = await Promise.all([
    User.findById(doc.creator).select("name avatar bio koFi patreon").lean(),
    ModFile.find({ mod: doc._id }).lean(),
  ]);
  return toMod({ ...doc, creator }, files);
}

export async function getGame(slug: string) {
  return GAMES.find((g) => g.slug === slug) ?? null;
}

export function getGames() {
  return GAMES;
}

export async function getModFiles(modId: string) {
  const conn = await connectDB();
  if (!conn) return [];
  return ModFile.find({ mod: modId }).lean();
}