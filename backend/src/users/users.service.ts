import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Person, PersonDocument } from '../schemas/PersonDocument/person.schema.js';

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
  birthday: string;
  phoneNumber: string;
  emergencyContact: EmergencyContact;
}

@Injectable()
export class UsersService implements OnModuleInit {
  private readonly seedUsers: User[] = [
    {
      id: '7f4d1c8e-2f1a-4c6d-9a12-8b4e5d7c1234',
      firstName: 'Colin',
      lastName: 'Muster',
      birthday: '2002-04-18',
      phoneNumber: '+41 79 123 45 67',
      emergencyContact: {
        firstName: 'Anna',
        lastName: 'Muster',
        phoneNumber: '+41 78 234 56 78',
        relationship: 'Mutter',
      },
    },
    {
      id: '1a2b3c4d-1111-4444-8888-123456789abc',
      firstName: 'Hans',
      lastName: 'Meier',
      birthday: '1999-11-03',
      phoneNumber: '+41 76 345 67 89',
      emergencyContact: {
        firstName: 'Peter',
        lastName: 'Meier',
        phoneNumber: '+41 77 456 78 90',
        relationship: 'Vater',
      },
    },
    {
      id: '2b3c4d5e-2222-4444-8888-abcdef123456',
      firstName: 'Max',
      lastName: 'Keller',
      birthday: '2001-07-22',
      phoneNumber: '+41 79 567 89 01',
      emergencyContact: {
        firstName: 'Laura',
        lastName: 'Keller',
        phoneNumber: '+41 78 678 90 12',
        relationship: 'Schwester',
      },
    },
    {
      id: '3c4d5e6f-3333-4444-8888-987654abcdef',
      firstName: 'Sophie',
      lastName: 'Huber',
      birthday: '2003-02-14',
      phoneNumber: '+41 76 789 01 23',
      emergencyContact: {
        firstName: 'Thomas',
        lastName: 'Huber',
        phoneNumber: '+41 77 890 12 34',
        relationship: 'Vater',
      },
    },
    {
      id: '4d5e6f70-5555-4444-8888-fedcba654321',
      firstName: 'Nina',
      lastName: 'Schmid',
      birthday: '2000-09-30',
      phoneNumber: '+41 79 901 23 45',
      emergencyContact: {
        firstName: 'Martin',
        lastName: 'Schmid',
        phoneNumber: '+41 78 012 34 56',
        relationship: 'Partner',
      },
    },
  ];

  constructor(
    @InjectModel(Person.name) private readonly personModel: Model<PersonDocument>,
  ) {}

  async onModuleInit(): Promise<void> {
    await this.personModel.bulkWrite(
      this.seedUsers.map(user => ({
        updateOne: {
          filter: { id: user.id },
          update: { $setOnInsert: user },
          upsert: true,
        },
      })),
    );
  }

  findAll(): Promise<User[]> {
    return this.personModel.find().select('-_id -__v').lean<User[]>().exec();
  }

  findById(id: string): Promise<User | null> {
    return this.personModel
      .findOne({ id })
      .select('-_id -__v')
      .lean<User>()
      .exec();
  }
}