import { withAuth } from "next-auth/middleware";

export default withAuth({
  callbacks: {
    authorized: ({ req, token }) => {
      const isApi = req.nextUrl.pathname.startsWith("/api/");
      // Allow all GET requests to API routes to be public
      if (isApi && req.method === "GET") {
        return true;
      }
      
      // For dashboard and mutating APIs, require a valid token AND an admin role
      return !!token && token.role === "admin";
    },
  },
  pages: {
    signIn: "/login",
  },
});

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/api/content",
    "/api/content/:path*",
    "/api/settings",
    "/api/settings/:path*",
    "/api/upload",
    "/api/upload/:path*"
  ]
};
