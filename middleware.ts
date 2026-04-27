import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('adminToken')?.value;
  const path = request.nextUrl.pathname;

  const isDashboard = path.startsWith('/dashboard');
  const isApi = path.startsWith('/api/');
  const isAuthApi = path.startsWith('/api/auth/');
  const isSetupApi = path.startsWith('/api/setup-db');
  const isMutatingApi = isApi && !isAuthApi && !isSetupApi && ['POST', 'PUT', 'DELETE'].includes(request.method);

  // Helper to verify JWT
  const verifyToken = async (t: string) => {
    try {
      const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'fallback-secret-for-development-only-change-in-prod');
      await jwtVerify(t, secret);
      return true;
    } catch (error) {
      return false;
    }
  };

  // Protect Dashboard
  if (isDashboard) {
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    const isValid = await verifyToken(token);
    if (!isValid) {
      // Clear invalid cookie
      const response = NextResponse.redirect(new URL('/login', request.url));
      response.cookies.delete('adminToken');
      return response;
    }
    return NextResponse.next();
  }

  // Protect Mutating APIs
  if (isMutatingApi) {
    if (!token) {
      return NextResponse.json({ success: false, error: 'Unauthorized: Missing token' }, { status: 401 });
    }
    const isValid = await verifyToken(token);
    if (!isValid) {
      return NextResponse.json({ success: false, error: 'Unauthorized: Invalid token' }, { status: 401 });
    }
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
