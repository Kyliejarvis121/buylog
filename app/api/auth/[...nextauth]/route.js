import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prismadb";
import { compare } from "bcryptjs";

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    // Google OAuth for farmers
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    // Credentials login
    CredentialsProvider({
      name: "Credentials",
      credentials: { email: { type: "email" }, password: { type: "password" } },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await prisma.user.findUnique({ where: { email: credentials.email } });
        if (!user || !user.password) return null;

        const isValid = await compare(credentials.password, user.password);
        if (!isValid) return null;

        // Only allow farmers
        if (user.role !== "FARMER") return null;

        return user;
      },
    }),
  ],
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.email = user.email;
      }

      // Google login
      if (account?.provider === "google") {
        const email = token.email || user?.email;
        if (email) {
          let existingUser = await prisma.user.findUnique({ where: { email } });

          if (!existingUser) {
            // Create farmer only
            const newUser = await prisma.user.create({
              data: {
                name: token.name || "Google Farmer",
                email,
                role: "FARMER", // <-- Important: only farmer can register
                password: null,
                emailVerified: true,
              },
            });
            token.id = newUser.id;
            token.role = newUser.role;
          } else {
            if (existingUser.role !== "FARMER") {
              throw new Error("Only farmers can login");
            }
            token.id = existingUser.id;
            token.role = existingUser.role;
          }
        }
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
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
