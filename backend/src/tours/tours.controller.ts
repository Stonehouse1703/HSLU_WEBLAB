import {
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Body,
  NotFoundException,
  Param,
} from '@nestjs/common';
import { ToursService } from './tours.service.js';

@Controller('tours')
export class ToursController {
  constructor(private readonly toursService: ToursService) {}

  @Post()
  create(@Body() body: { name: string; date: string; time: string; location: string; difficulty: string; altitude: string }) {
    return this.toursService.create(body);
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
    @Body() body: { role?: 'admin' | 'participant' },
  ) {
    if (body.role !== 'admin' && body.role !== 'participant') {
      throw new NotFoundException('Ungültige Benutzerrolle.');
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
