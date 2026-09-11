
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ _id: false })
export class EmergencyContact {
  @Prop()
  firstName: string;

  @Prop()
  lastName: string;

  @Prop()
  phoneNumber: string;

  @Prop()
  relationship: string;
}

export const EmergencyContactSchema = SchemaFactory.createForClass(EmergencyContact);
