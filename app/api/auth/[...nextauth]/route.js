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
    // FIXED GOOGLE LOGIN
    // --------------------------
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,

      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
        };
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user, account }) {
      // First run
      if (user) token.id = user.id;

      // Google login logic
      if (account?.provider === "google") {
        const existing = await prisma.user.findUnique({
          where: { email: token.email },
        });

        if (!existing) {
          const newUser = await prisma.user.create({
            data: {
              email: token.email,
              name: token.name,
              image: token.picture,
              password: null, // VERY IMPORTANT FIX
              emailVerified: new Date(),
            },
          });

          token.id = newUser.id;
        } else {
          token.id = existing.id;
        }
      }

      return token;
    },

    async session({ session, token }) {
      session.user.id = token.id;
      return session;
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
