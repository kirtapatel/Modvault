import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { isAdminSession } from "@/lib/admin";
import { connectDB } from "@/lib/mongodb";
import Mod from "@/models/Mod";
import User from "@/models/User";
import Admin from "@/models/Admin";
import type { LeanMod } from "@/lib/mongo-types";

export async function GET() {
  const session = await auth();
  if (!(await isAdminSession(session))) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const conn = await connectDB();
  if (!conn) {
    return NextResponse.json({
      mods: 0,
      users: 0,
      admins: 1,
      downloads: 0,
      latestMods: [],
    });
  }

  try {
    const [mods, users, admins, agg] = await Promise.all([
      Mod.countDocuments(),
      User.countDocuments(),
      Admin.countDocuments(),
      Mod.aggregate([{ $group: { _id: null, total: { $sum: "$downloads" } } }]),
    ]);

    const latestMods = (await Mod.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("creator", "name email")
      .lean()) as unknown as LeanMod[];

    return NextResponse.json({
      mods,
      users,
      admins: admins + 1,
      downloads: agg[0]?.total ?? 0,
      latestMods: latestMods.map((m) => ({
        id: String(m._id),
        title: m.title,
        slug: m.slug,
        game: m.game,
        downloads: m.downloads || 0,
        createdAt: new Date(m.createdAt || Date.now()).toISOString(),
        creatorName: m.creator?.name ?? "Unknown",
      })),
    });
  } catch (error) {
    console.error("Admin stats error:", error);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}