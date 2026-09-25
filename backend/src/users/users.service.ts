import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { randomUUID } from 'node:crypto';
import { Person, PersonDocument } from '../schemas/PersonDocument/person.schema.js';
import { UpdateUserDto } from './dto/update-user.dto.js';

export interface EmergencyContact {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  relationship: string;
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email?: string;
  birthday: string;
  phoneNumber: string;
  emergencyContact: EmergencyContact;
}

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(Person.name) private readonly personModel: Model<PersonDocument>,
  ) {}

  findAll(): Promise<User[]> {
    return this.personModel
      .find()
      .select('-_id -__v -passwordHash -emergencyContact')
      .lean<User[]>()
      .exec();
  }

  findByIds(ids: string[]): Promise<User[]> {
    if (!ids || ids.length === 0) {
      return Promise.resolve([]);
    }
    return this.personModel
      .find({ id: { $in: ids } })
      .select('-_id -__v -passwordHash -emergencyContact')
      .lean<User[]>()
      .exec();
  }

  findById(id: string): Promise<User | null> {
    return this.personModel
      .findOne({ id })
      .select('-_id -__v -passwordHash -emergencyContact')
      .lean<User>()
      .exec();
  }

  findByIdWithEmergencyContact(id: string): Promise<User | null> {
    return this.personModel
      .findOne({ id })
      .select('-_id -__v -passwordHash')
      .lean<User>()
      .exec();
  }

  findByEmail(email: string): Promise<PersonDocument | null> {
    return this.personModel.findOne({ email: email.toLowerCase().trim() }).exec();
  }

  async create(userData: {
    firstName: string;
    lastName: string;
    email: string;
    passwordHash: string;
    birthday?: string;
    phoneNumber?: string;
    emergencyContact?: EmergencyContact;
  }): Promise<User> {
    const id = randomUUID();
    const createdPerson = await this.personModel.create({
      id,
      firstName: userData.firstName.trim(),
      lastName: userData.lastName.trim(),
      email: userData.email.toLowerCase().trim(),
      passwordHash: userData.passwordHash,
      birthday: userData.birthday ?? '',
      phoneNumber: userData.phoneNumber ?? '',
      emergencyContact: userData.emergencyContact ?? {
        firstName: '',
        lastName: '',
        phoneNumber: '',
        relationship: '',
      },
    });

    const userObj = createdPerson.toObject({ versionKey: false });
    const { _id, passwordHash: _, ...user } = userObj;
    return user as User;
  }

  async update(id: string, data: UpdateUserDto): Promise<User | null> {
    const updatePayload: Record<string, any> = {};
    if (data.firstName !== undefined) updatePayload.firstName = data.firstName.trim();
    if (data.lastName !== undefined) updatePayload.lastName = data.lastName.trim();
    if (data.birthday !== undefined) updatePayload.birthday = data.birthday;
    if (data.phoneNumber !== undefined) updatePayload.phoneNumber = data.phoneNumber.trim();
    if (data.emergencyContact !== undefined) {
      updatePayload.emergencyContact = {
        firstName: data.emergencyContact.firstName?.trim() ?? '',
        lastName: data.emergencyContact.lastName?.trim() ?? '',
        phoneNumber: data.emergencyContact.phoneNumber?.trim() ?? '',
        relationship: data.emergencyContact.relationship?.trim() ?? '',
      };
    }

    return this.personModel
      .findOneAndUpdate(
        { id },
        { $set: updatePayload },
        { returnDocument: 'after' },
      )
      .select('-_id -__v -passwordHash')
      .lean<User>()
      .exec();
  }
}

