import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { supabase } from "./supabase";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      role: string;
      image?: string | null;
    };
  }
  interface User {
    role: string;
  }
}

// Map capability to the portal role
function getPrimaryRole(capabilities: { capability: string; status: string }[]): string {
  const active = capabilities.filter((c) => c.status === "ACTIVE").map((c) => c.capability);
  // Priority: ADMIN > DOCTOR > AFFILIATE > PAYER > BENEFICIARY
  if (active.includes("ADMIN")) return "ADMIN";
  if (active.includes("DOCTOR")) return "DOCTOR";
  if (active.includes("AFFILIATE")) return "AFFILIATE";
  if (active.includes("PAYER")) return "PAYER";
  if (active.includes("BENEFICIARY")) return "BENEFICIARY";
  return "BENEFICIARY";
}

export const roleRedirects: Record<string, string> = {
  ADMIN: "/admin/dashboard",
  DOCTOR: "/doctor/patient-care",
  AFFILIATE: "/affiliate/dashboard",
  PAYER: "/member/dashboard",
  BENEFICIARY: "/member/dashboard",
};

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: { strategy: "jwt" },
  pages: { signIn: "/auth/signin" },
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        // Get user with password hash
        const { data: user, error: userErr } = await supabase
          .from("users")
          .select("id, name, email, password_hash")
          .eq("email", credentials.email as string)
          .single();

        if (userErr || !user) return null;

        // Verify password: bcrypt hash or plain dev-password fallback
        const password = credentials.password as string;
        if (user.password_hash?.startsWith("$2")) {
          const valid = await bcrypt.compare(password, user.password_hash);
          if (!valid) return null;
        } else {
          // Legacy/seed data: plain text comparison
          if (password !== user.password_hash) return null;
        }

        // Get capabilities to determine role
        const { data: capabilities } = await supabase
          .from("capabilities")
          .select("capability, status")
          .eq("user_id", user.id);

        const role = getPrimaryRole(capabilities || []);

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role,
          image: null,
        };
      },
    }),
  ],
  callbacks: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async jwt({ token, user }: any) {
      if (user) {
        token.role = user.role;
        token.userId = user.id;
      }
      return token;
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async session({ session, token }: any) {
      session.user.role = token.role;
      session.user.id = token.userId;
      return session;
    },
  },
});
