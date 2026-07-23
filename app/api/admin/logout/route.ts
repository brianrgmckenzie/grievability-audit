import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const res = NextResponse.redirect(new URL('/admin/login', req.url));
  res.cookies.delete({ name: 'admin_session', path: '/' });
  return res;
}
