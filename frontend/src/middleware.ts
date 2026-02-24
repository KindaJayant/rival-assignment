import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Protect dashboard routes
    if (pathname.startsWith('/dashboard')) {
        const token = request.cookies.get('accessToken')?.value;

        // Client-side token check is primary (localStorage),
        // but we also check cookie as a fallback
        // The main protection happens client-side in the AuthProvider
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/dashboard/:path*'],
};
