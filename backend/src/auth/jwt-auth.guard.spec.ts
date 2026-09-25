import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { describe, expect, it } from 'vitest';
import { JwtAuthGuard } from './jwt-auth.guard.js';
import { generateToken, TokenPayload } from './auth.utils.js';

describe('JwtAuthGuard', () => {
  const guard = new JwtAuthGuard();

  const mockPayload: TokenPayload = {
    id: 'user-123',
    email: 'test@example.ch',
    firstName: 'Test',
    lastName: 'User',
  };

  const createMockContext = (authHeader?: string): ExecutionContext => {
    const request: { headers: Record<string, string | undefined>; user?: any } = {
      headers: {
        authorization: authHeader,
      },
    };

    return {
      switchToHttp: () => ({
        getRequest: () => request,
        getResponse: () => ({}),
        getNext: () => ({}),
      }),
    } as unknown as ExecutionContext;
  };

  it('should allow access and attach user to request when token is valid', () => {
    const token = generateToken(mockPayload);
    const context = createMockContext(`Bearer ${token}`);

    const result = guard.canActivate(context);

    expect(result).toBe(true);
    const req = context.switchToHttp().getRequest();
    expect(req.user).toBeDefined();
    expect(req.user.id).toBe('user-123');
    expect(req.user.email).toBe('test@example.ch');
  });

  it('should throw UnauthorizedException when no Authorization header is provided', () => {
    const context = createMockContext(undefined);

    expect(() => guard.canActivate(context)).toThrow(UnauthorizedException);
    expect(() => guard.canActivate(context)).toThrow('Nicht authentifiziert.');
  });

  it('should throw UnauthorizedException when token is invalid or malformed', () => {
    const context = createMockContext('Bearer invalid.jwt.token');

    expect(() => guard.canActivate(context)).toThrow(UnauthorizedException);
    expect(() => guard.canActivate(context)).toThrow('Nicht authentifiziert.');
  });
});
