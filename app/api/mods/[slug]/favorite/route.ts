import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import Mod from "@/models/Mod";

export async function POST(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const session = await auth();
  const { slug } = await params;
  const { modId } = await request.json().catch(() => ({ modId: null }));
  const id = modId ?? slug;

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  try {
    const conn = await connectDB();
    if (!conn) {
      return NextResponse.json({ favorite: false, demo: true }, { status: 200 });
    }

    const mod = await Mod.findById(id);
    if (!mod) return NextResponse.json({ error: "Mod not found." }, { status: 404 });

    const { default: User } = await import("@/models/User");
    const user = await User.findById(session.user.id);
    if (!user) return NextResponse.json({ error: "User not found." }, { status: 404 });

    const favorites: string[] = (user.favorites || []).map(String);
    const exists = favorites.includes(String(mod._id));
    if (exists) {
      user.favorites = favorites.filter((f) => f !== String(mod._id));
      await user.save();
      return NextResponse.json({ favorite: false });
    } else {
      user.favorites = [...favorites, String(mod._id)];
      await user.save();
      return NextResponse.json({ favorite: true });
    }
  } catch (error) {
    console.error("Favorite error:", error);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}