import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import bcrypt from "bcryptjs";
import { prisma } from "./prismadb";

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

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          isVerified: user.emailVerified,
        };
      },
    }),
  ],

  callbacks: {
    // JWT callback — runs on login and session refresh
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.role = user.role;
        token.isVerified = user.isVerified;

        // ✅ AUTO CREATE FARMER PROFILE IF NOT EXIST
        if (user.role === "FARMER") {
          const exists = await prisma.farmer.findFirst({
            where: { userId: user.id },
          });

          if (!exists) {
            await prisma.farmer.create({
              data: {
                userId: user.id,
                name: user.name || "Farmer",
                isActive: true,
              },
            });
          }
        }

        // fetch profile avatar
        const profile = await prisma.profile.findUnique({
          where: { userId: user.id },
        });

        token.avatar = profile?.avatar || null;
      }

      return token;
    },

    // session callback — exposes data to client
    async session({ session, token }) {
      session.user = {
        id: token.id,
        name: token.name,
        email: token.email,
        role: token.role,
        isVerified: token.isVerified,
        avatar: token.avatar || null,
      };

      return session;
    },
  },
};