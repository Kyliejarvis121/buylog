import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/login",
  },
  callbacks: {
    authorized: ({ token }) => {
      return !!token; // allow only if logged in
    },
  },
});

export const config = {
  matcher: ["/dashboard/:path*"], // protect dashboard only
};