import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { UsersService, User } from './users.service.js';
import { Person } from '../schemas/PersonDocument/person.schema.js';

describe('UsersService', () => {
  let usersService: UsersService;
  let mockPersonModel: any;

  const sampleUser: User = {
    id: 'user-colin',
    firstName: 'Colin',
    lastName: 'Muster',
    email: 'colin@muster.ch',
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
    mockPersonModel = {
      create: vi.fn(),
      find: vi.fn(),
      findOne: vi.fn(),
      findOneAndUpdate: vi.fn(),
      bulkWrite: vi.fn().mockResolvedValue({}),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getModelToken(Person.name),
          useValue: mockPersonModel,
        },
      ],
    }).compile();

    usersService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(usersService).toBeDefined();
  });

  describe('findAll', () => {
    it('should find all users and strip sensitive fields', async () => {
      const mockQuery = {
        select: vi.fn().mockReturnThis(),
        lean: vi.fn().mockReturnThis(),
        exec: vi.fn().mockResolvedValue([sampleUser]),
      };
      mockPersonModel.find.mockReturnValue(mockQuery);

      const result = await usersService.findAll();

      expect(mockPersonModel.find).toHaveBeenCalled();
      expect(mockQuery.select).toHaveBeenCalledWith(
        '-_id -__v -passwordHash -emergencyContact',
      );
      expect(result).toEqual([sampleUser]);
    });
  });

  describe('findById', () => {
    it('should find single user by ID', async () => {
      const mockQuery = {
        select: vi.fn().mockReturnThis(),
        lean: vi.fn().mockReturnThis(),
        exec: vi.fn().mockResolvedValue(sampleUser),
      };
      mockPersonModel.findOne.mockReturnValue(mockQuery);

      const result = await usersService.findById('user-colin');

      expect(mockPersonModel.findOne).toHaveBeenCalledWith({ id: 'user-colin' });
      expect(result).toEqual(sampleUser);
    });
  });

  describe('create', () => {
    it('should create and return new user with generated UUID', async () => {
      mockPersonModel.create.mockImplementation((data: any) => ({
        toObject: () => ({ _id: 'mongo-id', ...data }),
      }));

      const input = {
        firstName: '  Hans  ',
        lastName: '  Meier  ',
        email: '  Hans@Meier.ch  ',
        passwordHash: 'salt:hash',
        birthday: '1995-05-15',
        phoneNumber: '+41 76 111 22 33',
      };

      const result = await usersService.create(input);

      expect(result.id).toBeDefined();
      expect(result.firstName).toBe('Hans');
      expect(result.lastName).toBe('Meier');
      expect(result.email).toBe('hans@meier.ch');
    });
  });

  describe('update', () => {
    it('should update user fields and return updated user', async () => {
      const updatedUser = { ...sampleUser, firstName: 'Colin-Updated' };
      const mockQuery = {
        select: vi.fn().mockReturnThis(),
        lean: vi.fn().mockReturnThis(),
        exec: vi.fn().mockResolvedValue(updatedUser),
      };
      mockPersonModel.findOneAndUpdate.mockReturnValue(mockQuery);

      const result = await usersService.update('user-colin', {
        firstName: 'Colin-Updated',
      });

      expect(mockPersonModel.findOneAndUpdate).toHaveBeenCalledWith(
        { id: 'user-colin' },
        { $set: { firstName: 'Colin-Updated' } },
        { returnDocument: 'after' },
      );
      expect(result).toEqual(updatedUser);
    });
  });
});
