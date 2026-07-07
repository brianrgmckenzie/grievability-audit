'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const canSubmit = email.trim().length > 0 && password.length > 0;

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email.trim(), password }),
    });

    if (res.ok) {
      router.push('/admin');
    } else {
      setError('Invalid credentials');
      setLoading(false);
    }
  }

  const inputStyle = {
    fontFamily: "'Hanken Grotesk', sans-serif",
    fontSize: '16px',
    color: 'var(--cream)',
    background: 'var(--card)',
    border: '1px solid var(--border)',
    borderRadius: '12px',
    padding: '16px 18px',
    outline: 'none',
    width: '100%',
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <div style={{ width: '100%', maxWidth: '360px' }}>
        <div style={{ fontFamily: "'Roboto', sans-serif", fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--amber)', marginBottom: '12px' }}>
          Reframe Concepts
        </div>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 500, fontSize: '32px', color: 'var(--cream)', margin: '0 0 32px', lineHeight: 1.1 }}>
          Admin
        </h1>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            autoComplete="email"
            autoFocus
            style={inputStyle}
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            autoComplete="current-password"
            style={inputStyle}
          />

          {error && (
            <p style={{ fontSize: '13px', color: '#ff8a80', margin: 0 }}>{error}</p>
          )}

          <button
            type="submit"
            disabled={!canSubmit || loading}
            style={{
              fontFamily: "'Hanken Grotesk', sans-serif",
              fontSize: '15px',
              fontWeight: 600,
              borderRadius: '12px',
              padding: '16px',
              border: 'none',
              marginTop: '4px',
              cursor: canSubmit && !loading ? 'pointer' : 'not-allowed',
              background: canSubmit && !loading ? 'var(--amber)' : 'var(--card)',
              color: canSubmit && !loading ? 'var(--ink)' : 'var(--muted)',
              transition: 'all 0.15s ease',
            }}
          >
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  );
}
