import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";

export const authConfig: NextAuthConfig = {
  session: { strategy: "jwt" },
  pages: { signIn: "/login" },
  secret: process.env.AUTH_SECRET,
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        const { connectDB } = await import("@/lib/mongodb");
        const User = (await import("@/models/User")).default;

        const conn = await connectDB();
        if (!conn) return null;

        const user = await User.findOne({ email: credentials?.email }).lean();
        if (!user) return null;

        const bcrypt = (await import("bcryptjs")).default;
        const match = await bcrypt.compare(String(credentials?.password ?? ""), user.password);
        if (!match) return null;

        return {
          id: String(user._id),
          email: user.email,
          name: user.name,
          image: user.avatar || null,
        };
      },
    }),
  ],
  callbacks: {
    jwt: async ({ token, user }) => {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.picture = user.image || null;
      }
      return token;
    },
    session: async ({ session, token }) => {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.name = token.name as string;
        session.user.image = (token.picture as string) || null;
      }
      return session;
    },
  },
};

export default authConfig;