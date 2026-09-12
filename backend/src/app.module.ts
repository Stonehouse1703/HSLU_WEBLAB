import { Module } from '@nestjs/common';
import { createObserveModule } from '@nestjs/observe';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { UsersController } from './users/users.controller.js';
import { UsersService } from './users/users.service.js';
import { ToursController } from './tours/tours.controller.js';
import { ToursService } from './tours/tours.service.js';
import { MongooseModule } from '@nestjs/mongoose';
import { Person, PersonSchema } from './schemas/PersonDocument/person.schema.js';
import { Tour, TourSchema } from './schemas/TourDocument/tour.schema.js';

export const { ObserveModule, ObserveInstrument } = createObserveModule();

@Module({
  imports: [
    MongooseModule.forRoot(
      process.env.MONGO_URI ?? 'mongodb://localhost:27017/nest',
    ),
    MongooseModule.forFeature([
      { name: Person.name, schema: PersonSchema },
      { name: Tour.name, schema: TourSchema },
    ]),
    ObserveModule.forRoot({
      appKey: 'YOUR_APP_KEY',
      appSecret: 'YOUR_APP_SECRET',
      serviceId: 'backend',
    }),
  ],
  controllers: [AppController, UsersController, ToursController],
  providers: [AppService, UsersService, ToursService],
})
export class AppModule {}
