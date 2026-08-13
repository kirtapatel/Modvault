import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { isOwner, isAdminSession, listAdminEmails } from "@/lib/admin";
import { connectDB } from "@/lib/mongodb";
import Admin from "@/models/Admin";

export async function GET() {
  const session = await auth();
  if (!session || !(await isAdminSession(session))) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  return NextResponse.json({ admins: await listAdminEmails() });
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session || !(await isAdminSession(session))) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  if (!isOwner(session.user?.email)) {
    return NextResponse.json({ error: "Only the owner can add admins." }, { status: 403 });
  }

  const { email } = await request.json();
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Invalid email address." }, { status: 400 });
  }

  const conn = await connectDB();
  if (!conn) {
    return NextResponse.json({ error: "Database not configured." }, { status: 503 });
  }

  const normalized = email.toLowerCase();
  const exists = await Admin.findOne({ email: normalized }).lean();
  if (exists) {
    return NextResponse.json({ error: "This email is already an admin." }, { status: 409 });
  }

  await Admin.create({ email: normalized, addedBy: session.user.id });
  return NextResponse.json({ ok: true, admins: await listAdminEmails() }, { status: 201 });
}

export async function DELETE(request: Request) {
  const session = await auth();
  if (!session || !(await isAdminSession(session))) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  if (!isOwner(session.user?.email)) {
    return NextResponse.json({ error: "Only the owner can remove admins." }, { status: 403 });
  }

  const { email } = await request.json();
  if (!email) return NextResponse.json({ error: "Missing email." }, { status: 400 });

  const normalized = email.toLowerCase();
  if (normalized === "pkirtan546@gmail.com") {
    return NextResponse.json({ error: "The owner admin cannot be removed." }, { status: 400 });
  }

  const conn = await connectDB();
  if (!conn) {
    return NextResponse.json({ error: "Database not configured." }, { status: 503 });
  }

  await Admin.deleteOne({ email: normalized });
  return NextResponse.json({ ok: true, admins: await listAdminEmails() });
}