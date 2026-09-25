import { describe, it, expect } from 'vitest';
import {
  hashPassword,
  verifyPassword,
  generateToken,
  verifyToken,
  extractUserFromHeader,
  TokenPayload,
} from './auth.utils.js';

describe('Auth Utils', () => {
  describe('hashPassword and verifyPassword', () => {
    it('should generate a valid bcrypt hash format', () => {
      const hash = hashPassword('my-secret-password');
      expect(hash).toMatch(/^\$2[ab]\$\d+\$/);
      expect(hash.length).toBeGreaterThan(50);
    });

    it('should verify correct password successfully', () => {
      const password = 'alpine-security-2026';
      const hash = hashPassword(password);
      expect(verifyPassword(password, hash)).toBe(true);
    });

    it('should fail verification for incorrect password', () => {
      const hash = hashPassword('correct-password');
      expect(verifyPassword('wrong-password', hash)).toBe(false);
    });

    it('should return false for invalid or corrupted hash format', () => {
      expect(verifyPassword('password', '')).toBe(false);
      expect(verifyPassword('password', 'invalid-hash-format')).toBe(false);
    });
  });

  describe('generateToken and verifyToken', () => {
    const payload: TokenPayload = {
      id: 'usr-123',
      email: 'test@hslu.ch',
      firstName: 'Max',
      lastName: 'Muster',
    };

    it('should generate a 3-part JWT token', () => {
      const token = generateToken(payload);
      const parts = token.split('.');
      expect(parts.length).toBe(3);
    });

    it('should verify and decode valid token', () => {
      const token = generateToken(payload);
      const verified = verifyToken(token);

      expect(verified).not.toBeNull();
      expect(verified?.id).toBe(payload.id);
      expect(verified?.email).toBe(payload.email);
      expect(verified?.firstName).toBe(payload.firstName);
      expect(verified?.lastName).toBe(payload.lastName);
    });

    it('should return null for tampered token signature', () => {
      const token = generateToken(payload);
      const parts = token.split('.');
      const tamperedToken = `${parts[0]}.${parts[1]}.invalidsignature123`;

      expect(verifyToken(tamperedToken)).toBeNull();
    });

    it('should return null for malformed or empty token', () => {
      expect(verifyToken('')).toBeNull();
      expect(verifyToken('abc.def')).toBeNull();
    });
  });

  describe('extractUserFromHeader', () => {
    it('should return null when header is missing or does not start with Bearer', () => {
      expect(extractUserFromHeader(undefined)).toBeNull();
      expect(extractUserFromHeader('')).toBeNull();
      expect(extractUserFromHeader('Basic xyz')).toBeNull();
    });

    it('should extract and verify user when valid Bearer token is provided', () => {
      const payload: TokenPayload = {
        id: 'usr-456',
        email: 'anna@hslu.ch',
        firstName: 'Anna',
        lastName: 'Muster',
      };
      const token = generateToken(payload);
      const extracted = extractUserFromHeader(`Bearer ${token}`);

      expect(extracted).not.toBeNull();
      expect(extracted?.id).toBe('usr-456');
      expect(extracted?.email).toBe('anna@hslu.ch');
    });
  });
});
