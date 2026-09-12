import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type TourDocument = HydratedDocument<Tour>;

@Schema()
export class Tour {
  @Prop({ required: true, unique: true })
  id: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  date: string;

  @Prop({ required: true })
  time: string;

  @Prop({ required: true })
  location: string;

  @Prop({ required: true })
  difficulty: string;

  @Prop({ required: true })
  altitude: string;

  @Prop({ type: [String], required: true, default: [] })
  tourManagerIds: string[];

  @Prop({ type: [String], required: true, default: [] })
  participantIds: string[];
}

export const TourSchema = SchemaFactory.createForClass(Tour);
