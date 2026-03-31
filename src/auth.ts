import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import { getPrisma } from "@/lib/db";

export const authOptions: NextAuthOptions = {
    session: { strategy: "jwt" },
    providers: [
        CredentialsProvider({
            name: "credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Parolă", type: "password" },
            },
            async authorize(credentials) {
                const email = String(credentials?.email || "");
                const password = String(credentials?.password || "");
                const prisma = getPrisma();

                const user = await prisma.user.findUnique({ where: { email } });
                if (!user) return null;

                const ok = await bcrypt.compare(password, user.password);
                if (!ok) return null;

                // IMPORTANT: NextAuth v4 cere cel puțin id + email în user
                return { id: user.id, email: user.email, role: user.role } as any;
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) (token as any).role = (user as any).role;
            return token;
        },
        async session({ session, token }) {
            (session as any).role = (token as any).role;
            (session.user as any).role = (token as any).role;
            return session;
        },
    },
    pages: {
        // opțional: dacă ai pagină custom de login
        signIn: "/admin/login",
    },
};