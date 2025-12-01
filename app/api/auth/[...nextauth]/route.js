import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prismadb";
import { compare } from "bcrypt";

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  pages: { signIn: "/login" },
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: { email: {}, password: {} },
      async authorize(credentials) {
        if (!credentials.email || !credentials.password) return null;
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });
        if (!user) return null;

        const isValidPassword = await compare(credentials.password, user.password);
        if (!isValidPassword) return null;

        return user;
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      profile(profile) {
        // This CANNOT be async
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
      if (user) {
        token.id = user.id;
        token.role = user.role; // attach role from DB
      }

      if (account?.provider === "google") {
        const existing = await prisma.user.findUnique({ where: { email: token.email } });

        if (!existing) {
          const newUser = await prisma.user.create({
            data: {
              email: token.email,
              name: token.name,
              image: token.picture,
              password: null,
              emailVerified: new Date(),
              role: "USER", // default role
            },
          });
          token.id = newUser.id;
          token.role = newUser.role;
        } else {
          token.id = existing.id;
          token.role = existing.role || "USER";
        }
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.role = token.role || "USER"; // attach role
      }
      return session;
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
