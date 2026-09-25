import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { randomUUID } from 'node:crypto';
import { Tour, TourDocument } from '../schemas/TourDocument/tour.schema.js';
import { UpdateTourDto } from './dto/update-tour.dto.js';

@Injectable()
export class ToursService {
  constructor(
    @InjectModel(Tour.name) private readonly tourModel: Model<TourDocument>,
  ) {}

  async create(
    data: {
      name: string;
      date: string;
      time: string;
      location: string;
      difficulty: string;
      altitude: string;
      distance?: string;
      cost?: number;
      travelRoute?: string;
      requirements?: string;
      gpxData?: string;
      securityMatrix?: Record<string, any>;
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
      distance: data.distance?.trim() ?? '',
      cost:
        typeof data.cost === 'number'
          ? Math.round(data.cost)
          : data.cost !== undefined
            ? parseInt(String(data.cost), 10) || 0
            : 0,
      travelRoute: data.travelRoute?.trim() ?? '',
      requirements: data.requirements?.trim() ?? '',
      gpxData: data.gpxData,
      securityMatrix: data.securityMatrix,
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

  joinTour(tourId: string, userId: string): Promise<Tour | null> {
    return this.tourModel
      .findOneAndUpdate(
        { id: tourId },
        {
          $pull: { tourManagerIds: userId },
          $addToSet: { participantIds: userId },
        },
        { returnDocument: 'after' },
      )
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
        { returnDocument: 'after' },
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
        { returnDocument: 'after' },
      )
      .select('-_id -__v')
      .lean<Tour>()
      .exec();
  }

  update(id: string, data: UpdateTourDto): Promise<Tour | null> {
    const updatePayload: Record<string, any> = {};
    if (data.name !== undefined) updatePayload.name = data.name.trim();
    if (data.date !== undefined) updatePayload.date = data.date;
    if (data.time !== undefined) updatePayload.time = data.time;
    if (data.location !== undefined) updatePayload.location = data.location.trim();
    if (data.difficulty !== undefined) updatePayload.difficulty = data.difficulty;
    if (data.altitude !== undefined) updatePayload.altitude = data.altitude;
    if (data.distance !== undefined) updatePayload.distance = data.distance.trim();
    if (data.cost !== undefined) {
      updatePayload.cost =
        typeof data.cost === 'number'
          ? Math.round(data.cost)
          : parseInt(String(data.cost), 10) || 0;
    }
    if (data.travelRoute !== undefined) updatePayload.travelRoute = data.travelRoute.trim();
    if (data.requirements !== undefined) updatePayload.requirements = data.requirements.trim();
    if (data.gpxData !== undefined) updatePayload.gpxData = data.gpxData;
    if (data.securityMatrix !== undefined) updatePayload.securityMatrix = data.securityMatrix;

    return this.tourModel
      .findOneAndUpdate(
        { id },
        { $set: updatePayload },
        { returnDocument: 'after' },
      )
      .select('-_id -__v')
      .lean<Tour>()
      .exec();
  }

  delete(id: string): Promise<boolean> {
    return this.tourModel
      .deleteOne({ id })
      .exec()
      .then(res => (res.deletedCount ?? 0) > 0);
  }
}
