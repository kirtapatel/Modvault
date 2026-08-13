import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";

export async function PATCH(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  try {
    const { name, bio, koFi, patreon, avatar } = await request.json();
    const conn = await connectDB();
    if (!conn) {
      return NextResponse.json({ error: "Database not configured." }, { status: 503 });
    }

    const { default: User } = await import("@/models/User");
    const user = await User.findById(session.user.id);
    if (!user) return NextResponse.json({ error: "User not found." }, { status: 404 });

    if (name !== undefined) user.name = name;
    if (bio !== undefined) user.bio = bio;
    if (koFi !== undefined) user.koFi = koFi;
    if (patreon !== undefined) user.patreon = patreon;
    if (avatar !== undefined) user.avatar = avatar;
    await user.save();

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Profile update error:", error);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}