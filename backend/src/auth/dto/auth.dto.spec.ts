import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { describe, expect, it } from 'vitest';
import { LoginDto } from './login.dto.js';
import { RegisterDto } from './register.dto.js';

describe('Auth DTOs Validation', () => {
  describe('LoginDto', () => {
    it('should validate valid login credentials', async () => {
      const dto = plainToInstance(LoginDto, {
        email: 'colin@muster.ch',
        password: 'password123',
      });
      const errors = await validate(dto);
      expect(errors.length).toBe(0);
    });

    it('should reject invalid email format', async () => {
      const dto = plainToInstance(LoginDto, {
        email: 'invalid-email',
        password: 'password123',
      });
      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('email');
    });

    it('should reject empty password', async () => {
      const dto = plainToInstance(LoginDto, {
        email: 'colin@muster.ch',
        password: '',
      });
      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('password');
    });
  });

  describe('RegisterDto', () => {
    it('should validate valid registration data', async () => {
      const dto = plainToInstance(RegisterDto, {
        firstName: 'Colin',
        lastName: 'Muster',
        email: 'colin@muster.ch',
        password: 'password123',
        birthday: '2000-01-01',
        phoneNumber: '+41 79 123 45 67',
        emergencyContact: {
          firstName: 'Anna',
          lastName: 'Muster',
          phoneNumber: '+41 78 234 56 78',
          relationship: 'Mutter',
        },
      });
      const errors = await validate(dto);
      expect(errors.length).toBe(0);
    });

    it('should reject password shorter than 6 characters', async () => {
      const dto = plainToInstance(RegisterDto, {
        firstName: 'Colin',
        lastName: 'Muster',
        email: 'colin@muster.ch',
        password: '123',
      });
      const errors = await validate(dto);
      expect(errors.some(e => e.property === 'password')).toBe(true);
    });

    it('should reject missing required fields', async () => {
      const dto = plainToInstance(RegisterDto, {});
      const errors = await validate(dto);
      const props = errors.map(e => e.property);
      expect(props).toContain('firstName');
      expect(props).toContain('lastName');
      expect(props).toContain('email');
      expect(props).toContain('password');
    });
  });
});
