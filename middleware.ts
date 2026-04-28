import { withAuth } from "next-auth/middleware";
import { NextRequest, NextResponse } from "next/server";

// Simple in-memory rate limit map for Edge
// Note: This is per-isolate. In Vercel Edge, isolates are ephemeral.
// For strict global rate-limiting, consider @upstash/ratelimit.
const rateLimitMap = new Map<string, { count: number; lastReset: number }>();
const RATE_LIMIT_WINDOW_MS = 60000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 60; // 60 requests per minute

const authMiddleware = withAuth({
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

export default async function middleware(req: NextRequest) {
  // 1. Rate Limiting Check
  const ip = req.headers.get("x-forwarded-for") || req.ip || "127.0.0.1";
  const now = Date.now();
  let record = rateLimitMap.get(ip);
  
  if (!record || now - record.lastReset > RATE_LIMIT_WINDOW_MS) {
    record = { count: 1, lastReset: now };
  } else {
    record.count += 1;
  }
  
  rateLimitMap.set(ip, record);

  if (record.count > MAX_REQUESTS_PER_WINDOW) {
    return new NextResponse(
      JSON.stringify({ error: "Too Many Requests. Please slow down." }),
      { status: 429, headers: { "Content-Type": "application/json" } }
    );
  }

  // 2. Authentication Check
  return (authMiddleware as any)(req);
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/api/:path*", // Apply rate-limiting to all API routes
  ]
};
