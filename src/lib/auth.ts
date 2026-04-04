import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
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
        if (!credentials?.email) return null;

        const { data, error } = await supabase
          .from("users")
          .select("id, name, email, role, image")
          .eq("email", credentials.email as string)
          .single();

        if (error || !data) return null;

        return {
          id: data.id,
          name: data.name,
          email: data.email,
          role: data.role,
          image: data.image,
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
