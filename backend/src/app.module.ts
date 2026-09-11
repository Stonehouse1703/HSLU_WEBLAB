import { Module } from '@nestjs/common';
import { createObserveModule } from '@nestjs/observe';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { UsersController } from './users/users.controller.js';
import { UsersService } from './users/users.service.js';
import { MongooseModule } from '@nestjs/mongoose';
import { Person, PersonSchema } from './schemas/PersonDocument/person.schema.js';

export const { ObserveModule, ObserveInstrument } = createObserveModule();

@Module({
  imports: [
    MongooseModule.forRoot(
      process.env.MONGO_URI ?? 'mongodb://localhost:27017/nest',
    ),
    MongooseModule.forFeature([{ name: Person.name, schema: PersonSchema }]),
    ObserveModule.forRoot({
      appKey: 'YOUR_APP_KEY',
      appSecret: 'YOUR_APP_SECRET',
      serviceId: 'backend',
    }),
  ],
  controllers: [AppController, UsersController],
  providers: [AppService, UsersService],
})
export class AppModule {}
