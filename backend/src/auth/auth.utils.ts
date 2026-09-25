import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const JWT_SECRET = process.env.JWT_SECRET || 'hslu_weblab_super_secret_jwt_key_2026';

export function hashPassword(password: string): string {
  return bcrypt.hashSync(password, 10);
}

export function verifyPassword(password: string, storedHash: string): boolean {
  if (!storedHash) {
    return false;
  }
  try {
    return bcrypt.compareSync(password, storedHash);
  } catch {
    return false;
  }
}

export interface TokenPayload {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  exp?: number;
}

export function generateToken(payload: TokenPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });
}

export function verifyToken(token: string): TokenPayload | null {
  if (!token) return null;
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as TokenPayload;
    return decoded;
  } catch {
    return null;
  }
}

export function extractUserFromHeader(authHeader?: string): TokenPayload | null {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  const token = authHeader.substring(7).trim();
  return verifyToken(token);
}
