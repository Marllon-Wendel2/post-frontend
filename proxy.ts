import { NextResponse, type NextRequest } from 'next/server';

const PROTECTED_PATHS = ['/home', '/search', '/post', '/profile'];

/**
 * Guard equivalente ao RedirectComponent + guards de ngOnInit do Angular.
 * O token mora em cookie (mesma regra do app Angular): com token -> /home,
 * sem token -> /login nas rotas protegidas.
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('natura_token')?.value;

  if (pathname === '/') {
    return NextResponse.redirect(new URL(token ? '/home' : '/login', request.url));
  }

  const isProtected = PROTECTED_PATHS.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`)
  );

  if (isProtected && !token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/home/:path*', '/search/:path*', '/post/:path*', '/profile/:path*', '/'],
};
