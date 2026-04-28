import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { checkRateLimit, recordFailedAttempt, clearFailedAttempts } from "@/lib/rate-limit";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          throw new Error("Missing username or password");
        }

        // Check Rate Limit (Brute Force Protection)
        const rateLimit = checkRateLimit(credentials.username);
        if (!rateLimit.success) {
          const resetMinutes = Math.ceil((rateLimit.resetTime! - Date.now()) / 60000);
          throw new Error(`Account locked due to too many failed attempts. Try again in ${resetMinutes} minutes.`);
        }

        const user = await prisma.user.findUnique({
          where: { username: credentials.username }
        });

        if (!user) {
          const remaining = recordFailedAttempt(credentials.username);
          throw new Error(`Invalid username or password. ${remaining} attempts left before lockout.`);
        }

        const isValid = await bcrypt.compare(credentials.password, user.password);

        if (!isValid) {
          const remaining = recordFailedAttempt(credentials.username);
          throw new Error(`Invalid username or password. ${remaining} attempts left before lockout.`);
        }

        // Success - clear any failed attempts
        clearFailedAttempts(credentials.username);

        return {
          id: user.id.toString(),
          name: user.username,
          email: user.email,
          role: user.role
        };
      }
    })
  ],
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 24 hours
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.role = token.role as string;
        session.user.id = token.id as string;
      }
      return session;
    }
  },
  pages: {
    signIn: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET || process.env.JWT_SECRET || "fallback-secret-for-development-only-change-in-prod",
};
