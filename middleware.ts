import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
    // Check role admin
    function middleware(req) {
        if (req.nextUrl.pathname.startsWith('/admin')) {
            const role = req.nextauth.token?.role;
            if (role !== 'admin') {
                return NextResponse.redirect(new URL('/auth/login?error=unauthorized', req.url));
            }
        }
    },
    {
        callbacks: {
            authorized: ({ token }) => !!token, // Login requis pour middleware
        },
    }
);

export const config = {
    matcher: ['/admin/:path*'], // TOUT /admin/* protégé
};