import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { isOwner, isAdminSession } from "@/lib/admin";

export async function GET() {
  const session = await auth();
  if (!session || !(await isAdminSession(session))) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  return NextResponse.json({ owner: isOwner(session.user?.email) });
}