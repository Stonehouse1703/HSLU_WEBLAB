import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ToursService } from './tours.service.js';
import { CreateTourDto } from './dto/create-tour.dto.js';
import { UpdateTourDto } from './dto/update-tour.dto.js';
import { SetUserRoleDto } from './dto/set-user-role.dto.js';
import { UsersService } from '../users/users.service.js';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import { CurrentUser } from '../auth/current-user.decorator.js';
import type { TokenPayload } from '../auth/auth.utils.js';

@Controller('tours')
@UseGuards(JwtAuthGuard)
export class ToursController {
  constructor(
    private readonly toursService: ToursService,
    private readonly usersService: UsersService,
  ) {}

  @Post()
  create(
    @Body() body: CreateTourDto,
    @CurrentUser() user: TokenPayload,
  ) {
    if (body.date) {
      const today = new Date();
      const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
      if (body.date < todayStr) {
        throw new BadRequestException(
          'Das Datum darf nicht in der Vergangenheit liegen.',
        );
      }
    }

    return this.toursService.create(body, user.id);
  }

  @Get('my-tours')
  findUserTours(@CurrentUser() user: TokenPayload) {
    return this.toursService.findUserTours(user.id);
  }

  @Get(':id/members')
  async findTourMembers(@Param('id') id: string) {
    const tour = await this.toursService.findById(id);
    if (!tour) {
      throw new NotFoundException('Tour wurde nicht gefunden.');
    }

    const allIds = [
      ...tour.tourManagerIds,
      ...tour.participantIds,
    ];
    const users = await this.usersService.findByIds(allIds);
    const userMap = new Map(users.map(u => [u.id, u]));

    return {
      tourManagers: tour.tourManagerIds.map(uid => userMap.get(uid)).filter(Boolean),
      participants: tour.participantIds.map(uid => userMap.get(uid)).filter(Boolean),
    };
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    const tour = await this.toursService.findById(id);

    if (!tour) {
      throw new NotFoundException('Tour wurde nicht gefunden.');
    }

    return tour;
  }

  @Post(':tourId/join')
  async joinTour(
    @Param('tourId') tourId: string,
    @CurrentUser() user: TokenPayload,
  ) {
    const existingTour = await this.toursService.findById(tourId);
    if (!existingTour) {
      throw new NotFoundException('Tour wurde nicht gefunden.');
    }

    if (existingTour.date) {
      const today = new Date();
      const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
      const cleanedDate = existingTour.date.includes('T')
        ? existingTour.date.split('T')[0].trim()
        : existingTour.date.trim();
      if (cleanedDate < todayStr) {
        throw new BadRequestException(
          'Vergangenen Touren kann nicht mehr beigetreten werden.',
        );
      }
    }

    if (existingTour.tourManagerIds.includes(user.id)) {
      return existingTour;
    }

    const tour = await this.toursService.joinTour(tourId, user.id);
    return tour ?? existingTour;
  }

  @Get(':tourId/users/:userId/emergency-contact')
  async getEmergencyContact(
    @Param('tourId') tourId: string,
    @Param('userId') userId: string,
    @CurrentUser() user: TokenPayload,
  ) {
    const isAdmin = await this.toursService.getUserRoleByTour(
      tourId,
      user.id,
    );
    if (!isAdmin) {
      throw new ForbiddenException('Keine Administratorrechte.');
    }

    const targetUser = await this.usersService.findByIdWithEmergencyContact(
      userId,
    );
    if (!targetUser) {
      throw new NotFoundException('Person wurde nicht gefunden.');
    }

    return targetUser;
  }

  @Delete(':tourId/users/:userId')
  async removeUser(
    @Param('tourId') tourId: string,
    @Param('userId') userId: string,
    @CurrentUser() user: TokenPayload,
  ) {
    const isAdmin = await this.toursService.getUserRoleByTour(
      tourId,
      user.id,
    );
    if (!isAdmin) {
      throw new ForbiddenException('Keine Administratorrechte.');
    }

    if (user.id === userId) {
      throw new ForbiddenException(
        'Die Tourleitung kann sich nicht selbst aus der Tour entfernen.',
      );
    }

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
    @CurrentUser() user: TokenPayload,
  ) {
    const role = body.role;

    const isAdmin = await this.toursService.getUserRoleByTour(
      tourId,
      user.id,
    );
    if (!isAdmin) {
      throw new ForbiddenException('Keine Administratorrechte.');
    }

    if (role !== 'admin' && role !== 'participant') {
      throw new BadRequestException('Ungültige Benutzerrolle.');
    }

    if (user.id === userId && role === 'participant') {
      throw new ForbiddenException(
        'Die Tourleitung kann sich nicht selbst zum Teilnehmer zurückstufen.',
      );
    }

    const tour = await this.toursService.setUserRole(
      tourId,
      userId,
      role,
    );

    if (!tour) {
      throw new NotFoundException('Tour wurde nicht gefunden.');
    }

    return tour;
  }

  @Patch(':id')
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() body: UpdateTourDto,
    @CurrentUser() user: TokenPayload,
  ) {
    const isAdmin = await this.toursService.getUserRoleByTour(id, user.id);
    if (!isAdmin) {
      throw new ForbiddenException('Keine Administratorrechte für diese Tour.');
    }

    const updatedTour = await this.toursService.update(id, body);
    if (!updatedTour) {
      throw new NotFoundException('Tour wurde nicht gefunden.');
    }

    return updatedTour;
  }
}
