import { UnauthorizedException } from '@nestjs/common';
import { describe, expect, it } from 'vitest';
import { JwtStrategy } from './jwt.strategy.js';

describe('JwtStrategy', () => {
  const strategy = new JwtStrategy();

  it('should validate and extract user payload when payload contains id', () => {
    const payload = {
      id: 'usr-999',
      email: 'anna@example.ch',
      firstName: 'Anna',
      lastName: 'Meier',
    };

    const result = strategy.validate(payload);

    expect(result).toEqual({
      id: 'usr-999',
      email: 'anna@example.ch',
      firstName: 'Anna',
      lastName: 'Meier',
    });
  });

  it('should fallback missing string fields to empty strings', () => {
    const payload = {
      id: 'usr-999',
    };

    const result = strategy.validate(payload);

    expect(result).toEqual({
      id: 'usr-999',
      email: '',
      firstName: '',
      lastName: '',
    });
  });

  it('should throw UnauthorizedException when payload has no id', () => {
    expect(() => strategy.validate({})).toThrow(UnauthorizedException);
    expect(() => strategy.validate(null)).toThrow(UnauthorizedException);
  });
});
