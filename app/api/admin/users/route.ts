import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { isAdminSession } from "@/lib/admin";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

export async function GET(request: Request) {
  const session = await auth();
  if (!(await isAdminSession(session))) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const page = Math.max(1, Number(searchParams.get("page") ?? "1"));
  const perPage = 20;

  const conn = await connectDB();
  if (!conn) {
    return NextResponse.json({ users: [], total: 0 });
  }

  try {
    const total = await User.countDocuments();
    const docs = await User.find()
      .sort({ createdAt: -1 })
      .skip((page - 1) * perPage)
      .limit(perPage)
      .lean();

    return NextResponse.json({
      users: docs.map((u: any) => ({
        id: String(u._id),
        name: u.name,
        email: u.email,
        isPremium: u.isPremium,
        modCount: 0,
        createdAt: (u.createdAt || new Date()).toISOString(),
      })),
      total,
      page,
    });
  } catch (error) {
    console.error("Admin users error:", error);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const session = await auth();
  if (!session || !(await isAdminSession(session))) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const { id } = await request.json();
    if (!id) return NextResponse.json({ error: "Missing user id." }, { status: 400 });

    const conn = await connectDB();
    if (!conn) {
      return NextResponse.json({ error: "Database not configured." }, { status: 503 });
    }

    const target = await User.findById(id);
    if (!target) return NextResponse.json({ error: "User not found." }, { status: 404 });

    const me = await User.findById(session.user.id);
    if (me && String(me._id) === id) {
      return NextResponse.json({ error: "You cannot delete yourself." }, { status: 400 });
    }

    await User.deleteOne({ _id: id });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Admin delete user error:", error);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}