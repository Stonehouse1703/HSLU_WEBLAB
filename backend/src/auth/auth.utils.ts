import { createHmac, randomBytes, scryptSync, timingSafeEqual } from 'node:crypto';

const JWT_SECRET = process.env.JWT_SECRET || 'hslu_weblab_super_secret_jwt_key_2026';

export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString('hex');
  const hash = scryptSync(password, salt, 64).toString('hex');
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, storedHash: string): boolean {
  if (!storedHash || !storedHash.includes(':')) {
    return false;
  }
  const [salt, key] = storedHash.split(':');
  const keyBuffer = Buffer.from(key, 'hex');
  const derivedKey = scryptSync(password, salt, 64);
  return timingSafeEqual(keyBuffer, derivedKey);
}

export interface TokenPayload {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  exp?: number;
}

export function generateToken(payload: TokenPayload): string {
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
  const exp = Date.now() + 7 * 24 * 60 * 60 * 1000; // 7 days
  const body = Buffer.from(JSON.stringify({ ...payload, exp })).toString('base64url');
  const signature = createHmac('sha256', JWT_SECRET).update(`${header}.${body}`).digest('base64url');
  return `${header}.${body}.${signature}`;
}

export function verifyToken(token: string): TokenPayload | null {
  if (!token) return null;
  const parts = token.split('.');
  if (parts.length !== 3) return null;
  const [header, body, signature] = parts;
  const expectedSignature = createHmac('sha256', JWT_SECRET).update(`${header}.${body}`).digest('base64url');
  if (signature !== expectedSignature) return null;

  try {
    const data = JSON.parse(Buffer.from(body, 'base64url').toString('utf8')) as TokenPayload;
    if (data.exp && data.exp < Date.now()) {
      return null;
    }
    return data;
  } catch {
    return null;
  }
}
