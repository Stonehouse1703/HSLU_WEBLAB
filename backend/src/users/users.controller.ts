import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  NotFoundException,
  Param,
  Patch,
  Put,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service.js';
import { UpdateUserDto } from './dto/update-user.dto.js';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import { CurrentUser } from '../auth/current-user.decorator.js';
import type { TokenPayload } from '../auth/auth.utils.js';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  async findById(
    @Param('id') id: string,
    @CurrentUser() user: TokenPayload,
  ) {
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
    @CurrentUser() user: TokenPayload,
  ) {
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