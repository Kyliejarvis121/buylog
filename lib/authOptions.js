import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { compare } from "bcrypt";
import { prisma } from "@/lib/prismadb"; // make sure this points to your Prisma client

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  secret: process.env.NEXTAUTH_SECRET,
  session: { strategy: "jwt" },
  pages: { signIn: "/login" },

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

        // Use the correct Prisma model
        const existingUser = await prisma.users.findUnique({
          where: { email: credentials.email },
        });

        if (!existingUser) throw new Error("User not found");

        // Check password
        const valid = await compare(credentials.password, existingUser.password);
        if (!valid) throw new Error("Invalid password");

        // Return user object
        return {
          id: existingUser.id,
          name: existingUser.name,
          email: existingUser.email,
          role: existingUser.role,
          isVerified: existingUser.isVerified,
          phone: existingUser.phone,
        };
      },
    }),
  ],

  callbacks: {
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.name = token.name;
        session.user.email = token.email;
        session.user.role = token.role;
        session.user.isVerified = token.isVerified;
        session.user.phone = token.phone;
      }
      return session;
    },

    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.role = user.role;
        token.isVerified = user.isVerified;
        token.phone = user.phone;
      }
      return token;
    },
  },
};
