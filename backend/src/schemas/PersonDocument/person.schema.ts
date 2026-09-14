import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { EmergencyContact, EmergencyContactSchema } from './emergencyContact.schema.js';

export type PersonDocument = HydratedDocument<Person>;

@Schema()
export class Person {
  @Prop({ required: true, unique: true })
  id: string;

  @Prop()
  firstName: string;

  @Prop()
  lastName: string;

  @Prop({ unique: true, sparse: true })
  email?: string;

  @Prop()
  passwordHash?: string;

  @Prop()
  birthday: string;

  @Prop()
  phoneNumber: string;

  @Prop({ type: EmergencyContactSchema })
  emergencyContact: EmergencyContact;
}

export const PersonSchema = SchemaFactory.createForClass(Person);
