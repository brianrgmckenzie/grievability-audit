import { NextRequest, NextResponse } from 'next/server';
import { revokeSessionToken } from '@/lib/admin-auth';

export async function POST(req: NextRequest) {
  const res = NextResponse.redirect(new URL('/admin/login', req.url));

  const session = req.cookies.get('admin_session')?.value;
  const password = process.env.ADMIN_PASSWORD;
  if (session && password) await revokeSessionToken(session, password);

  res.cookies.delete({ name: 'admin_session', path: '/' });
  return res;
}
