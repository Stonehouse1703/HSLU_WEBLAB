import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ToursController } from './tours.controller.js';
import { ToursService } from './tours.service.js';
import { Tour, TourSchema } from '../schemas/TourDocument/tour.schema.js';
import { AuthModule } from '../auth/auth.module.js';
import { UsersModule } from '../users/users.module.js';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Tour.name, schema: TourSchema },
    ]),
    AuthModule,
    UsersModule,
  ],
  controllers: [ToursController],
  providers: [ToursService],
  exports: [ToursService],
})
export class ToursModule {}
