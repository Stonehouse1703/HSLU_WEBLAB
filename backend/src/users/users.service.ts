import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { randomUUID } from 'node:crypto';
import { Person, PersonDocument } from '../schemas/PersonDocument/person.schema.js';
import { hashPassword } from '../auth/auth.utils.js';

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
export class UsersService implements OnModuleInit {
  private readonly seedUsers: (User & { passwordHash?: string })[] = [
    {
      id: '7f4d1c8e-2f1a-4c6d-9a12-8b4e5d7c1234',
      firstName: 'Colin',
      lastName: 'Muster',
      email: 'colin@muster.ch',
      passwordHash: hashPassword('password123'),
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
      email: 'hans@meier.ch',
      passwordHash: hashPassword('password123'),
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
      email: 'max@keller.ch',
      passwordHash: hashPassword('password123'),
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
      email: 'sophie@huber.ch',
      passwordHash: hashPassword('password123'),
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
      email: 'nina@schmid.ch',
      passwordHash: hashPassword('password123'),
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
          update: {
            $set: {
              email: user.email,
              passwordHash: user.passwordHash,
            },
            $setOnInsert: {
              id: user.id,
              firstName: user.firstName,
              lastName: user.lastName,
              birthday: user.birthday,
              phoneNumber: user.phoneNumber,
              emergencyContact: user.emergencyContact,
            },
          },
          upsert: true,
        },
      })),
    );
  }

  findAll(): Promise<User[]> {
    return this.personModel.find().select('-_id -__v -passwordHash').lean<User[]>().exec();
  }

  findById(id: string): Promise<User | null> {
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
}
