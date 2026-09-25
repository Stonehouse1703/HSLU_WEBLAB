import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { AuthService } from './auth.service.js';
import { UsersService } from '../users/users.service.js';
import { hashPassword } from './auth.utils.js';

describe('AuthService', () => {
  let authService: AuthService;
  let usersService: {
    findByEmail: ReturnType<typeof vi.fn>;
    create: ReturnType<typeof vi.fn>;
  };
  let jwtService: {
    sign: ReturnType<typeof vi.fn>;
  };

  const mockUser = {
    id: 'user-1',
    firstName: 'Colin',
    lastName: 'Muster',
    email: 'colin@muster.ch',
    passwordHash: hashPassword('secret123'),
    birthday: '2000-01-01',
    phoneNumber: '+41 79 123 45 67',
    emergencyContact: {
      firstName: 'Anna',
      lastName: 'Muster',
      phoneNumber: '+41 78 234 56 78',
      relationship: 'Mutter',
    },
  };

  beforeEach(async () => {
    usersService = {
      findByEmail: vi.fn(),
      create: vi.fn(),
    };

    jwtService = {
      sign: vi.fn().mockReturnValue('mock-jwt-token-xyz'),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: usersService },
        { provide: JwtService, useValue: jwtService },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
  });

  describe('login', () => {
    it('should throw BadRequestException if email or password missing', async () => {
      await expect(authService.login({ email: '', password: '' })).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw UnauthorizedException if user does not exist', async () => {
      usersService.findByEmail.mockResolvedValue(null);

      await expect(
        authService.login({ email: 'notfound@muster.ch', password: 'secret123' }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException if password does not match', async () => {
      usersService.findByEmail.mockResolvedValue(mockUser);

      await expect(
        authService.login({ email: 'colin@muster.ch', password: 'wrongpassword' }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should return auth token and user on successful login', async () => {
      usersService.findByEmail.mockResolvedValue(mockUser);

      const result = await authService.login({
        email: 'colin@muster.ch',
        password: 'secret123',
      });

      expect(result.token).toBeDefined();
      expect(result.user).toEqual({
        id: mockUser.id,
        firstName: mockUser.firstName,
        lastName: mockUser.lastName,
        email: mockUser.email,
      });
    });
  });

  describe('register', () => {
    const registerDto = {
      firstName: 'Hans',
      lastName: 'Meier',
      email: 'hans@meier.ch',
      password: 'password123',
    };

    it('should throw BadRequestException if required fields are missing', async () => {
      await expect(
        authService.register({
          firstName: '',
          lastName: '',
          email: '',
          password: '',
        }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException if password is too short (< 6)', async () => {
      await expect(
        authService.register({
          ...registerDto,
          password: '123',
        }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException if email is already taken', async () => {
      usersService.findByEmail.mockResolvedValue(mockUser);

      await expect(authService.register(registerDto)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should create user, hash password and return token on successful registration', async () => {
      usersService.findByEmail.mockResolvedValue(null);
      usersService.create.mockResolvedValue({
        id: 'new-user-id',
        firstName: 'Hans',
        lastName: 'Meier',
        email: 'hans@meier.ch',
      });

      const result = await authService.register(registerDto);

      expect(usersService.create).toHaveBeenCalledWith(
        expect.objectContaining({
          firstName: 'Hans',
          lastName: 'Meier',
          email: 'hans@meier.ch',
          passwordHash: expect.stringMatching(/^\$2[ab]\$/),
        }),
      );
      expect(result.token).toBe('mock-jwt-token-xyz');
      expect(result.user.id).toBe('new-user-id');
    });
  });
});
