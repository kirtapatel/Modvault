import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import Comment from "@/models/Comment";
import User from "@/models/User";
import Mod from "@/models/Mod";
import { demoComments } from "@/lib/demo-data";
import type { LeanComment, LeanUserPublic } from "@/lib/mongo-types";

export async function GET(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  try {
    const conn = await connectDB();
    if (!conn) {
      return NextResponse.json({ comments: demoComments.filter((c) => c.modSlug === slug) });
    }
    const mod = await Mod.findOne({ slug });
    if (!mod) return NextResponse.json({ comments: [] });

    const comments = (await Comment.find({ mod: mod._id })
      .sort({ createdAt: 1 })
      .limit(100)
      .lean()) as unknown as LeanComment[];
    const authors = (await User.find({ _id: { $in: comments.map((c) => c.author) } })
      .select("name avatar")
      .lean()) as unknown as LeanUserPublic[];
    const authorMap = new Map(authors.map((a) => [String(a._id), a]));

    return NextResponse.json({
      comments: comments.map((c) => {
        const author = authorMap.get(String(c.author));
        return {
          id: String(c._id),
          modSlug: slug,
          author: author?.name ?? "Unknown",
          authorId: String(c.author),
          avatar: author?.avatar ?? null,
          text: c.text,
          createdAt: new Date(c.createdAt || Date.now()).toISOString(),
        };
      }),
    });
  } catch (error) {
    console.error("Get comments error:", error);
    return NextResponse.json({ comments: demoComments.filter((c) => c.modSlug === slug) });
  }
}

export async function POST(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Sign in to leave a comment." }, { status: 401 });
  }
  const { slug } = await params;
  const { text } = await request.json();

  if (!text || text.trim().length < 2) {
    return NextResponse.json({ error: "Comment must be at least 2 characters." }, { status: 400 });
  }

  try {
    const conn = await connectDB();
    if (!conn) {
      return NextResponse.json({ error: "Database not configured." }, { status: 503 });
    }

    const mod = await Mod.findOne({ slug });
    if (!mod) return NextResponse.json({ error: "Mod not found." }, { status: 404 });

    const comment = await Comment.create({ text: text.trim(), author: session.user.id, mod: mod._id });
    return NextResponse.json({ ok: true, comment: { id: String(comment._id), text: comment.text } }, { status: 201 });
  } catch (error) {
    console.error("Post comment error:", error);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}