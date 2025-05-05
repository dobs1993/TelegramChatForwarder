import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const verified = request.cookies.get('telegramVerified')?.value;
  const isProtected = request.nextUrl.pathname.startsWith('/dashboard');

  if (isProtected && verified !== 'true') {
    const url = request.nextUrl.clone();
    url.pathname = '/verify-code';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}
