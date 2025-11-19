import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { compare } from "bcrypt";
import db from "./db";

export const authOptions = {
  adapter: PrismaAdapter(db),
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
        try {
          console.log("Authorize credentials:", credentials);

          if (!credentials?.email || !credentials?.password) {
            throw new Error("Missing email or password");
          }

          // ✅ FIX: correct model name is db.users
          const existingUser = await db.users.findUnique({
            where: { email: credentials.email },
          });

          if (!existingUser) {
            throw new Error("User not found");
          }

          // Check password
          const valid = await compare(
            credentials.password,
            existingUser.password
          );

          if (!valid) {
            throw new Error("Invalid password");
          }

          // Return safe user fields
          return {
            id: existingUser.id,
            name: existingUser.name,
            email: existingUser.email,
            isAdmin: existingUser.isAdmin,
            isVerified: existingUser.isVerified,
            images: existingUser.images,
          };

        } catch (err) {
          console.log("Login failed:", err);
          throw new Error("Invalid credentials");
        }
      },
    }),
  ],

  callbacks: {
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.name = token.name;
        session.user.email = token.email;
        session.user.isAdmin = token.isAdmin;
        session.user.isVerified = token.isVerified;
        session.user.images = token.images;
      }
      return session;
    },

    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.isAdmin = user.isAdmin;
        token.isVerified = user.isVerified;
        token.images = user.images;
      }
      return token;
    },
  },
};
