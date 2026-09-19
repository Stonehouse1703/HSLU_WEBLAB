import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { randomUUID } from 'node:crypto';
import { Tour, TourDocument } from '../schemas/TourDocument/tour.schema.js';

@Injectable()
export class ToursService implements OnModuleInit {
  private readonly seedTours: Tour[] = [
    {
      id: '7f4d1c8e-2f1a-4c6d-9a12-8b4e5d7c1234',
      name: 'Zugerberg',
      date: '2023-01-01',
      time: '9:00',
      location: 'GIBZ',
      difficulty: 'easy',
      altitude: '2000m',
      tourManagerIds: ['7f4d1c8e-2f1a-4c6d-9a12-8b4e5d7c1234'],
      participantIds: [
        '1a2b3c4d-1111-4444-8888-123456789abc',
        '2b3c4d5e-2222-4444-8888-abcdef123456',
        '3c4d5e6f-3333-4444-8888-987654abcdef',
      ],
    },
    {
      id: '1a2b3c4d-1111-4444-8888-123456789abc',
      name: 'Pilatus',
      date: '2023-01-01',
      time: '10:00',
      location: 'KIBZ',
      difficulty: 'easy',
      altitude: '1000m',
      tourManagerIds: ['1a2b3c4d-1111-4444-8888-123456789abc'],
      participantIds: [
        '7f4d1c8e-2f1a-4c6d-9a12-8b4e5d7c1234',
        '2b3c4d5e-2222-4444-8888-abcdef123456',
        '4d5e6f70-5555-4444-8888-fedcba654321',
      ],
    },
  ];

  constructor(
    @InjectModel(Tour.name) private readonly tourModel: Model<TourDocument>,
  ) {}

  async onModuleInit(): Promise<void> {
    await this.tourModel.bulkWrite(
      this.seedTours.map(tour => ({
        updateOne: {
          filter: { id: tour.id },
          update: { $setOnInsert: tour },
          upsert: true,
        },
      })),
    );
  }

  async create(
    data: {
      name: string;
      date: string;
      time: string;
      location: string;
      difficulty: string;
      altitude: string;
    },
    creatorId?: string,
  ): Promise<Tour> {
    const tour: Tour = {
      id: randomUUID(),
      name: data.name.trim(),
      date: data.date,
      time: data.time,
      location: data.location.trim(),
      difficulty: data.difficulty,
      altitude: data.altitude,
      tourManagerIds: creatorId ? [creatorId] : [],
      participantIds: [],
    };

    const createdTour = await this.tourModel.create(tour);
    const { _id, ...savedTour } = createdTour.toObject({ versionKey: false });

    return savedTour as Tour;
  }

  findUserTours(userId: string): Promise<Tour[]> {
    return this.tourModel
      .find({
        $or: [
          { tourManagerIds: userId },
          { participantIds: userId },
        ],
      })
      .select('-_id -__v')
      .lean<Tour[]>()
      .exec();
  }

  findById(id: string): Promise<Tour | null> {
    return this.tourModel
      .findOne({ id })
      .select('-_id -__v')
      .lean<Tour>()
      .exec();
  }

  async getUserRoleByTour(tourId: string, userId: string): Promise<boolean> {
    const tour = await this.tourModel
      .findOne({ id: tourId, tourManagerIds: userId })
      .select('_id')
      .lean()
      .exec();

    return tour !== null;
  }

  removeUser(tourId: string, userId: string): Promise<Tour | null> {
    return this.tourModel
      .findOneAndUpdate(
        { id: tourId },
        {
          $pull: {
            participantIds: userId,
            tourManagerIds: userId,
          },
        },
        { new: true },
      )
      .select('-_id -__v')
      .lean<Tour>()
      .exec();
  }

  setUserRole(
    tourId: string,
    userId: string,
    role: 'admin' | 'participant',
  ): Promise<Tour | null> {
    const update =
      role === 'admin'
        ? {
            $pull: { participantIds: userId },
            $addToSet: { tourManagerIds: userId },
          }
        : {
            $pull: { tourManagerIds: userId },
            $addToSet: { participantIds: userId },
          };

    return this.tourModel
      .findOneAndUpdate(
        { id: tourId },
        update,
        { new: true },
      )
      .select('-_id -__v')
      .lean<Tour>()
      .exec();
  }
}
