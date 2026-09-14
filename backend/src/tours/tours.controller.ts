import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  NotFoundException,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ToursService } from './tours.service.js';
import { CreateTourDto } from './dto/create-tour.dto.js';
import { SetUserRoleDto } from './dto/set-user-role.dto.js';
import { AuthService } from '../auth/auth.service.js';

@Controller('tours')
export class ToursController {
  constructor(
    private readonly toursService: ToursService,
    private readonly authService: AuthService,
  ) {}

  @Post()
  create(
    @Body() body: CreateTourDto,
    @Headers('authorization') authHeader?: string,
  ) {
    const user = this.authService.extractUserFromHeader(authHeader);
    return this.toursService.create(body, user?.id);
  }

  @Get()
  findAll() {
    return this.toursService.findAll();
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    const tour = await this.toursService.findById(id);

    if (!tour) {
      throw new NotFoundException('Tour wurde nicht gefunden.');
    }

    return tour;
  }

  @Delete(':tourId/users/:userId')
  async removeUser(
    @Param('tourId') tourId: string,
    @Param('userId') userId: string,
  ) {
    const tour = await this.toursService.removeUser(tourId, userId);

    if (!tour) {
      throw new NotFoundException('Tour wurde nicht gefunden.');
    }

    return tour;
  }

  @Patch(':tourId/users/:userId/role')
  async setUserRole(
    @Param('tourId') tourId: string,
    @Param('userId') userId: string,
    @Body() body: SetUserRoleDto,
  ) {
    if (body.role !== 'admin' && body.role !== 'participant') {
      throw new BadRequestException('Ungültige Benutzerrolle.');
    }

    const tour = await this.toursService.setUserRole(
      tourId,
      userId,
      body.role,
    );

    if (!tour) {
      throw new NotFoundException('Tour wurde nicht gefunden.');
    }

    return tour;
  }
}
