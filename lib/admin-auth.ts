import { Redis } from '@upstash/redis';

const SESSION_MAX_AGE = 60 * 60 * 24 * 7;
const redis = Redis.fromEnv();

async function computeSignature(issuedAt: string, password: string): Promise<string> {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    enc.encode(password),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const buf = await crypto.subtle.sign('HMAC', key, enc.encode(`admin:${issuedAt}`));
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

function constantTimeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

export async function verifySessionToken(token: string, password: string): Promise<boolean> {
  const dot = token.indexOf('.');
  if (dot === -1) return false;

  const issuedAt = token.slice(0, dot);
  const sig = token.slice(dot + 1);

  const age = Math.floor(Date.now() / 1000) - parseInt(issuedAt, 10);
  if (isNaN(age) || age < 0 || age > SESSION_MAX_AGE) return false;

  const expected = await computeSignature(issuedAt, password);
  if (!constantTimeEqual(sig, expected)) return false;

  const revoked = await redis.get(`ga:revoked:${token}`);
  return !revoked;
}

// Called on logout so a captured cookie can't be replayed for the rest of its
// 7-day window — the token itself has no server-side state otherwise.
// /api/admin/logout is reachable without an existing session, so the signature
// must be checked before writing anything: otherwise an unauthenticated caller
// could force unbounded Redis writes just by posting arbitrary cookie values.
export async function revokeSessionToken(token: string, password: string): Promise<void> {
  const dot = token.indexOf('.');
  if (dot === -1) return;

  const issuedAt = token.slice(0, dot);
  const sig = token.slice(dot + 1);

  const expected = await computeSignature(issuedAt, password);
  if (!constantTimeEqual(sig, expected)) return;

  const age = Math.floor(Date.now() / 1000) - parseInt(issuedAt, 10);
  const remaining = SESSION_MAX_AGE - age;
  if (isNaN(remaining) || remaining <= 0) return;

  await redis.set(`ga:revoked:${token}`, '1', { ex: remaining });
}
