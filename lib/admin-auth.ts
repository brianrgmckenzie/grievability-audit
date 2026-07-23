import { Redis } from '@upstash/redis';

const SESSION_MAX_AGE = 60 * 60 * 24 * 7;
const redis = Redis.fromEnv();

export async function verifySessionToken(token: string, password: string): Promise<boolean> {
  const dot = token.indexOf('.');
  if (dot === -1) return false;

  const issuedAt = token.slice(0, dot);
  const sig = token.slice(dot + 1);

  const age = Math.floor(Date.now() / 1000) - parseInt(issuedAt, 10);
  if (isNaN(age) || age < 0 || age > SESSION_MAX_AGE) return false;

  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    enc.encode(password),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const buf = await crypto.subtle.sign('HMAC', key, enc.encode(`admin:${issuedAt}`));
  const expected = Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');

  if (sig.length !== expected.length) return false;
  let diff = 0;
  for (let i = 0; i < sig.length; i++) diff |= sig.charCodeAt(i) ^ expected.charCodeAt(i);
  if (diff !== 0) return false;

  const revoked = await redis.get(`ga:revoked:${token}`);
  return !revoked;
}

// Called on logout so a captured cookie can't be replayed for the rest of its
// 7-day window — the token itself has no server-side state otherwise.
export async function revokeSessionToken(token: string): Promise<void> {
  const dot = token.indexOf('.');
  if (dot === -1) return;

  const issuedAt = parseInt(token.slice(0, dot), 10);
  if (isNaN(issuedAt)) return;

  const age = Math.floor(Date.now() / 1000) - issuedAt;
  const remaining = SESSION_MAX_AGE - age;
  if (remaining <= 0) return;

  await redis.set(`ga:revoked:${token}`, '1', { ex: remaining });
}
