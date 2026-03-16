import { serialize, parse } from 'cookie';

const SESSION_COOKIE = 'kv_session';
const SECRET = 'kala-vriksha-secret-key-2026-mystical';

// Simple base64 session (no external deps)
export function setSession(res, data) {
  const value = Buffer.from(JSON.stringify(data)).toString('base64');
  res.setHeader('Set-Cookie', serialize(SESSION_COOKIE, value, {
    httpOnly: true,
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    sameSite: 'lax',
  }));
}

export function getSession(req) {
  const cookies = parse(req.headers.cookie || '');
  const raw = cookies[SESSION_COOKIE];
  if (!raw) return null;
  try {
    return JSON.parse(Buffer.from(raw, 'base64').toString('utf-8'));
  } catch {
    return null;
  }
}

export function clearSession(res) {
  res.setHeader('Set-Cookie', serialize(SESSION_COOKIE, '', {
    httpOnly: true,
    path: '/',
    maxAge: 0,
  }));
}
