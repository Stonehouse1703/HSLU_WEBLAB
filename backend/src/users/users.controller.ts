import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  Headers,
  NotFoundException,
  Param,
  Patch,
  Put,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from './users.service.js';
import { extractUserFromHeader } from '../auth/auth.utils.js';
import { UpdateUserDto } from './dto/update-user.dto.js';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  async findById(
    @Param('id') id: string,
    @Headers('authorization') authHeader?: string,
  ) {
    const user = extractUserFromHeader(authHeader);

    // If viewing own profile, return with emergency contact
    if (user && user.id === id) {
      const self = await this.usersService.findByIdWithEmergencyContact(id);
      if (!self) {
        throw new NotFoundException('Person wurde nicht gefunden.');
      }
      return self;
    }

    const person = await this.usersService.findById(id);

    if (!person) {
      throw new NotFoundException('Person wurde nicht gefunden.');
    }

    return person;
  }

  @Patch(':id')
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() body: UpdateUserDto,
    @Headers('authorization') authHeader?: string,
  ) {
    const user = extractUserFromHeader(authHeader);

    if (!user) {
      throw new UnauthorizedException('Nicht authentifiziert.');
    }

    if (user.id !== id) {
      throw new ForbiddenException(
        'Du kannst nur dein eigenes Profil bearbeiten.',
      );
    }

    const updated = await this.usersService.update(id, body);

    if (!updated) {
      throw new NotFoundException('Person wurde nicht gefunden.');
    }

    return updated;
  }
}