import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prismadb";
import { compare } from "bcryptjs";

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    // Google OAuth for farmers only
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),

    // Credentials login
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { type: "email" },
        password: { type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user || !user.password || user.role !== "FARMER") return null;

        const isValid = await compare(credentials.password, user.password);
        if (!isValid) return null;

        return user;
      },
    }),
  ],

  session: { strategy: "jwt" },

  callbacks: {
    // JWT callback
    async jwt({ token, user, account }) {
      // Credentials login
      if (user) {
        token.id = user.id;
        token.role = user.role || "FARMER";
        token.email = user.email;
      }

      // Google OAuth login
      if (account?.provider === "google") {
        const email = token.email || user?.email;
        if (email) {
          let existingUser = await prisma.user.findUnique({ where: { email } });
          if (!existingUser) {
            // Only create a FARMER role
            const newUser = await prisma.user.create({
              data: {
                name: token.name || "Google Farmer",
                email,
                role: "FARMER",
                password: null,
                emailVerified: true,
              },
            });
            token.id = newUser.id;
            token.role = newUser.role;
          } else {
            token.id = existingUser.id;
            token.role = existingUser.role || "FARMER";
          }
        }
      }

      return token;
    },

    // Session callback
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.role = token.role || "FARMER";
        session.user.email = token.email;
      }
      return session;
    },
  },

  pages: {
    signIn: "/login",
  },

  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
