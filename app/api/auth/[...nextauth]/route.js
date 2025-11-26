import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prismadb";
import { compare } from "bcrypt";

export const authOptions = {
  adapter: PrismaAdapter(prisma),

  session: { strategy: "jwt" },

  pages: {
    signIn: "/login",
  },

  providers: [
    // --------------------------
    // CREDENTIALS LOGIN
    // --------------------------
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: {},
        password: {},
      },
      async authorize(credentials) {
        if (!credentials.email || !credentials.password) return null;

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user) return null;

        const isValidPassword = await compare(
          credentials.password,
          user.password
        );

        if (!isValidPassword) return null;

        return user;
      },
    }),

    // --------------------------
    // GOOGLE LOGIN
    // --------------------------
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],

  callbacks: {
    // Store user id in JWT
    async jwt({ token, user, account, profile }) {
      // First time JWT runs → store user id
      if (user) token.id = user.id;

      // If Google login → auto create user if not exist
      if (account?.provider === "google") {
        const existingUser = await prisma.user.findUnique({
          where: { email: token.email },
        });

        if (!existingUser) {
          const newUser = await prisma.user.create({
            data: {
              email: token.email,
              name: profile?.name || "Google User",
              password: "", // Google does not use password
              emailVerified: true,
            },
          });

          token.id = newUser.id;
        } else {
          token.id = existingUser.id;
        }
      }

      return token;
    },

    // Add user id to session
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
      }
      return session;
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
