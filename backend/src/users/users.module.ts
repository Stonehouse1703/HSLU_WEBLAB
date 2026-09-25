import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersController } from './users.controller.js';
import { UsersService } from './users.service.js';
import { Person, PersonSchema } from '../schemas/PersonDocument/person.schema.js';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Person.name, schema: PersonSchema },
    ]),
  ],
  controllers: [UsersController],
  providers: [UsersService, JwtAuthGuard],
  exports: [UsersService],
})
export class UsersModule {}
