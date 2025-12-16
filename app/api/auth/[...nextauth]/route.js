import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prismadb";
import { compare } from "bcryptjs";

const authOptions = {
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
        if (!credentials?.email || !credentials?.password) return null;

        const user = await prisma.user.findUnique({ where: { email: credentials.email } });
        if (!user || !user.password) return null;

        const isValid = await compare(credentials.password, user.password);
        if (!isValid) return null;

        return user;
      },
    }),

    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],

  callbacks: {
    async jwt({ token, user, account }) {
      // Attach user id & role
      if (user) {
        token.id = user.id;
        token.role = user.role || "USER";
      }

      // Google OAuth
      if (account?.provider === "google") {
        const email = token.email || user?.email;
        if (email) {
          let existing = await prisma.user.findUnique({ where: { email } });

          if (!existing) {
            // Create new OAuth user
            const newUser = await prisma.user.create({
              data: {
                email,
                name: token.name || "User",
                password: null, // OAuth users don't have password
                role: "USER",
                phone: null,
                emailVerified: true, // mark verified since Google verified it
              },
            });
            token.id = newUser.id;
            token.role = newUser.role;
          } else {
            token.id = existing.id;
            token.role = existing.role || "USER";

            // Update name if missing
            if (!existing.name) {
              await prisma.user.update({
                where: { id: existing.id },
                data: { name: token.name || existing.name },
              });
            }
          }
        }
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.role = token.role || "USER";
      }
      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
