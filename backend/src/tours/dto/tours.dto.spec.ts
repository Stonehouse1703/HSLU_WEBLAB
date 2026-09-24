import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { describe, expect, it } from 'vitest';
import { CreateTourDto } from './create-tour.dto.js';
import { UpdateTourDto } from './update-tour.dto.js';
import { SetUserRoleDto } from './set-user-role.dto.js';
import { UpdateUserDto } from '../../users/dto/update-user.dto.js';

describe('Tours & Users DTOs Validation', () => {
  describe('CreateTourDto', () => {
    it('should validate valid tour creation data', async () => {
      const dto = plainToInstance(CreateTourDto, {
        name: 'Pazolastock',
        date: '2026-12-01',
        time: '08:00',
        location: 'Andermatt',
        difficulty: 'mittel',
        altitude: '1200m',
        distance: '14 km',
        cost: 25,
        securityMatrix: {
          participants: 'bekannt',
          avalancheDanger: 2,
          dangerSources: ['Frischer Triebschnee'],
        },
      });
      const errors = await validate(dto);
      expect(errors.length).toBe(0);
    });

    it('should reject missing required tour fields', async () => {
      const dto = plainToInstance(CreateTourDto, {
        name: 'Nur Name',
      });
      const errors = await validate(dto);
      const props = errors.map(e => e.property);
      expect(props).toContain('date');
      expect(props).toContain('time');
      expect(props).toContain('location');
      expect(props).toContain('difficulty');
      expect(props).toContain('altitude');
    });

    it('should reject invalid cost type', async () => {
      const dto = plainToInstance(CreateTourDto, {
        name: 'Pazolastock',
        date: '2026-12-01',
        time: '08:00',
        location: 'Andermatt',
        difficulty: 'mittel',
        altitude: '1200m',
        cost: 'keine-zahl' as any,
      });
      const errors = await validate(dto);
      expect(errors.some(e => e.property === 'cost')).toBe(true);
    });
  });

  describe('UpdateTourDto', () => {
    it('should allow partial valid updates', async () => {
      const dto = plainToInstance(UpdateTourDto, {
        name: 'Neuer Name',
        cost: 30,
      });
      const errors = await validate(dto);
      expect(errors.length).toBe(0);
    });
  });

  describe('SetUserRoleDto', () => {
    it('should accept valid roles (admin, participant)', async () => {
      const adminDto = plainToInstance(SetUserRoleDto, { role: 'admin' });
      const participantDto = plainToInstance(SetUserRoleDto, { role: 'participant' });

      expect((await validate(adminDto)).length).toBe(0);
      expect((await validate(participantDto)).length).toBe(0);
    });

    it('should reject invalid role string', async () => {
      const dto = plainToInstance(SetUserRoleDto, { role: 'superadmin' as any });
      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('role');
    });
  });

  describe('UpdateUserDto', () => {
    it('should accept valid partial user profile update with emergency contact', async () => {
      const dto = plainToInstance(UpdateUserDto, {
        firstName: 'Colin',
        emergencyContact: {
          firstName: 'Anna',
          relationship: 'Mutter',
        },
      });
      const errors = await validate(dto);
      expect(errors.length).toBe(0);
    });
  });
});
