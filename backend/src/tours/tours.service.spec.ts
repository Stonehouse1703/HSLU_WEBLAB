import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ToursService } from './tours.service.js';
import { Tour } from '../schemas/TourDocument/tour.schema.js';

describe('ToursService', () => {
  let toursService: ToursService;
  let mockTourModel: any;

  const sampleTour = {
    id: 'tour-123',
    name: 'Pazolastock',
    date: '2026-10-15',
    time: '08:00',
    location: 'Oberalp',
    difficulty: 'mittel',
    altitude: '1100m',
    distance: '14 km',
    cost: 25,
    travelRoute: 'ÖV',
    requirements: 'B',
    tourManagerIds: ['user-1'],
    participantIds: ['user-2'],
  };

  beforeEach(async () => {
    mockTourModel = {
      create: vi.fn(),
      find: vi.fn(),
      findOne: vi.fn(),
      findOneAndUpdate: vi.fn(),
      bulkWrite: vi.fn().mockResolvedValue({}),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ToursService,
        {
          provide: getModelToken(Tour.name),
          useValue: mockTourModel,
        },
      ],
    }).compile();

    toursService = module.get<ToursService>(ToursService);
  });

  it('should be defined', () => {
    expect(toursService).toBeDefined();
  });

  describe('create', () => {
    it('should create and return a new tour with trimmed fields and creator as manager', async () => {
      mockTourModel.create.mockImplementation((tourData: any) => ({
        toObject: () => ({ _id: 'mongo-id', ...tourData }),
      }));

      const input = {
        name: '  Skitour Pazolastock  ',
        date: '2026-10-15',
        time: '08:00',
        location: '  Andermatt  ',
        difficulty: 'mittel',
        altitude: '1200m',
        cost: 25.4,
      };

      const result = await toursService.create(input, 'user-1');

      expect(result.id).toBeDefined();
      expect(result.name).toBe('Skitour Pazolastock');
      expect(result.location).toBe('Andermatt');
      expect(result.cost).toBe(25);
      expect(result.tourManagerIds).toEqual(['user-1']);
      expect(result.participantIds).toEqual([]);
    });
  });

  describe('findById', () => {
    it('should find tour by id without _id and __v', async () => {
      const mockQuery = {
        select: vi.fn().mockReturnThis(),
        lean: vi.fn().mockReturnThis(),
        exec: vi.fn().mockResolvedValue(sampleTour),
      };
      mockTourModel.findOne.mockReturnValue(mockQuery);

      const result = await toursService.findById('tour-123');

      expect(mockTourModel.findOne).toHaveBeenCalledWith({ id: 'tour-123' });
      expect(mockQuery.select).toHaveBeenCalledWith('-_id -__v');
      expect(result).toEqual(sampleTour);
    });
  });

  describe('findUserTours', () => {
    it('should find tours where user is manager or participant', async () => {
      const mockQuery = {
        select: vi.fn().mockReturnThis(),
        lean: vi.fn().mockReturnThis(),
        exec: vi.fn().mockResolvedValue([sampleTour]),
      };
      mockTourModel.find.mockReturnValue(mockQuery);

      const result = await toursService.findUserTours('user-1');

      expect(mockTourModel.find).toHaveBeenCalledWith({
        $or: [{ tourManagerIds: 'user-1' }, { participantIds: 'user-1' }],
      });
      expect(result).toEqual([sampleTour]);
    });
  });

  describe('joinTour', () => {
    it('should move user to participantIds and remove from tourManagerIds', async () => {
      const mockQuery = {
        select: vi.fn().mockReturnThis(),
        lean: vi.fn().mockReturnThis(),
        exec: vi.fn().mockResolvedValue(sampleTour),
      };
      mockTourModel.findOneAndUpdate.mockReturnValue(mockQuery);

      const result = await toursService.joinTour('tour-123', 'user-3');

      expect(mockTourModel.findOneAndUpdate).toHaveBeenCalledWith(
        { id: 'tour-123' },
        {
          $pull: { tourManagerIds: 'user-3' },
          $addToSet: { participantIds: 'user-3' },
        },
        { returnDocument: 'after' },
      );
      expect(result).toEqual(sampleTour);
    });
  });

  describe('setUserRole', () => {
    it('should promote user to admin/manager when role is admin', async () => {
      const mockQuery = {
        select: vi.fn().mockReturnThis(),
        lean: vi.fn().mockReturnThis(),
        exec: vi.fn().mockResolvedValue(sampleTour),
      };
      mockTourModel.findOneAndUpdate.mockReturnValue(mockQuery);

      await toursService.setUserRole('tour-123', 'user-2', 'admin');

      expect(mockTourModel.findOneAndUpdate).toHaveBeenCalledWith(
        { id: 'tour-123' },
        {
          $pull: { participantIds: 'user-2' },
          $addToSet: { tourManagerIds: 'user-2' },
        },
        { returnDocument: 'after' },
      );
    });
  });

  describe('delete', () => {
    it('should delete a tour by id and return true if found and deleted', async () => {
      mockTourModel.deleteOne = vi.fn().mockReturnValue({
        exec: vi.fn().mockResolvedValue({ deletedCount: 1 }),
      });

      const result = await toursService.delete('tour-123');

      expect(mockTourModel.deleteOne).toHaveBeenCalledWith({ id: 'tour-123' });
      expect(result).toBe(true);
    });

    it('should return false if tour was not found to delete', async () => {
      mockTourModel.deleteOne = vi.fn().mockReturnValue({
        exec: vi.fn().mockResolvedValue({ deletedCount: 0 }),
      });

      const result = await toursService.delete('non-existent');

      expect(result).toBe(false);
    });
  });
});
