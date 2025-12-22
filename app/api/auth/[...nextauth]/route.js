import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/lib/prismadb";
import bcrypt from "bcryptjs";

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  providers: [
    // Google OAuth
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),

    // Credentials (manual registration)
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Missing email or password");
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user) throw new Error("User not found");

        const isValid = await bcrypt.compare(credentials.password, user.password);
        if (!isValid) throw new Error("Invalid password");

        return user;
      },
    }),
  ],

  callbacks: {
    // Set role for Google users when they first sign up
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        // Check if role is already set
        if (!user.role) {
          await prisma.user.update({
            where: { id: user.id },
            data: { role: "FARMER" },
          });
        }
      }
      return true;
    },

    // Add role to session
    async session({ session, user }) {
      if (user?.role) {
        session.user.role = user.role;
      }
      return session;
    },

    // Add role to JWT
    async jwt({ token, user }) {
      if (user?.role) {
        token.role = user.role;
      }
      return token;
    },
  },

  events: {
    async error(message) {
      console.error("NextAuth Error:", message);
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
