import { connectDB } from "@/lib/mongodb";
import Admin from "@/models/Admin";

export const OWNER_EMAIL = "pkirtan546@gmail.com";

export function isOwner(email?: string | null): boolean {
  return !!email && email.toLowerCase() === OWNER_EMAIL;
}

export async function ensureOwnerAdmin(): Promise<boolean> {
  const conn = await connectDB();
  if (!conn) return false;
  try {
    const exists = await Admin.findOne({ email: OWNER_EMAIL }).lean();
    if (!exists) {
      await Admin.create({ email: OWNER_EMAIL, addedBy: null });
    }
    return true;
  } catch (error) {
    console.error("ensureOwnerAdmin error:", error);
    return false;
  }
}

export async function isAdminEmail(email?: string | null): Promise<boolean> {
  if (!email) return false;
  if (isOwner(email)) return true;
  const conn = await connectDB();
  if (!conn) return false;
  try {
    const doc = await Admin.findOne({ email: email.toLowerCase() }).lean();
    return !!doc;
  } catch (error) {
    console.error("isAdminEmail error:", error);
    return false;
  }
}

export async function isAdminSession(
  session: { user?: { email?: string | null; id?: string } } | null
): Promise<boolean> {
  if (!session?.user?.email) return false;
  return isAdminEmail(session.user.email);
}

export async function listAdminEmails(): Promise<string[]> {
  const conn = await connectDB();
  if (!conn) return [OWNER_EMAIL];
  const docs = await Admin.find().sort({ createdAt: 1 }).lean();
  const emails = docs.map((d) => d.email);
  if (!emails.includes(OWNER_EMAIL)) emails.unshift(OWNER_EMAIL);
  return emails;
}