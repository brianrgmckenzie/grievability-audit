import { NextResponse } from 'next/server';
import { createHmac, timingSafeEqual } from 'crypto';

export function makeSessionToken(password: string): string {
  const issuedAt = Math.floor(Date.now() / 1000).toString();
  const sig = createHmac('sha256', password).update(`admin:${issuedAt}`).digest('hex');
  return `${issuedAt}.${sig}`;
}

// Compare via HMAC so output length is always 32 bytes — no length timing leak
function safeEqual(a: string, b: string): boolean {
  const key = Buffer.alloc(32);
  const aSig = createHmac('sha256', key).update(a).digest();
  const bSig = createHmac('sha256', key).update(b).digest();
  return timingSafeEqual(aSig, bSig);
}

// Simple rate limiter: 5 attempts per IP per 15 minutes
const loginAttempts = new Map<string, { count: number; resetAt: number }>();
const LOGIN_LIMIT = 5;
const LOGIN_WINDOW_MS = 15 * 60 * 1000;

function checkLoginRate(ip: string): boolean {
  const now = Date.now();
  const entry = loginAttempts.get(ip);
  if (!entry || now > entry.resetAt) {
    loginAttempts.set(ip, { count: 1, resetAt: now + LOGIN_WINDOW_MS });
    return true;
  }
  if (entry.count >= LOGIN_LIMIT) return false;
  entry.count++;
  return true;
}

export async function POST(req: Request) {
  const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

  if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
    console.error('[admin/login] ADMIN_EMAIL or ADMIN_PASSWORD not set');
    return NextResponse.json({ error: 'Server misconfigured' }, { status: 500 });
  }

  const ip = (req.headers as Headers).get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';
  if (!checkLoginRate(ip)) {
    return NextResponse.json({ error: 'Too many attempts. Try again later.' }, { status: 429 });
  }

  const body = await req.json().catch(() => ({}));
  const email = typeof body.email === 'string' ? body.email.trim() : '';
  const password = typeof body.password === 'string' ? body.password : '';

  const emailValid = safeEqual(email, ADMIN_EMAIL);
  const pwdValid = safeEqual(password, ADMIN_PASSWORD);

  if (!emailValid || !pwdValid) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set('admin_session', makeSessionToken(ADMIN_PASSWORD), {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    maxAge: 60 * 60 * 24 * 7,
    path: '/admin',
  });
  return res;
}
