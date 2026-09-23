import { Module } from '@nestjs/common';
import { createObserveModule } from '@nestjs/observe';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { UsersModule } from './users/users.module.js';
import { ToursModule } from './tours/tours.module.js';
import { AuthModule } from './auth/auth.module.js';
import { MongooseModule } from '@nestjs/mongoose';

export const { ObserveModule, ObserveInstrument } = createObserveModule();

@Module({
  imports: [
    MongooseModule.forRootAsync({
      useFactory: () => ({
        uri: process.env.MONGO_URI ?? 'mongodb://localhost:27017/nest',
      }),
    }),
    UsersModule,
    ToursModule,
    AuthModule,
    ObserveModule.forRoot({
      appKey: process.env.OBSERVE_APP_KEY ?? 'HSLU_WEBLAB_APP_KEY',
      appSecret: process.env.OBSERVE_APP_SECRET ?? 'HSLU_WEBLAB_APP_SECRET',
      serviceId: 'backend',
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
