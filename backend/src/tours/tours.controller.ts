import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Headers,
  NotFoundException,
  Param,
  Patch,
  Post,
  Put,
  UnauthorizedException,
} from '@nestjs/common';
import { ToursService } from './tours.service.js';
import { CreateTourDto } from './dto/create-tour.dto.js';
import { UpdateTourDto } from './dto/update-tour.dto.js';
import { SetUserRoleDto } from './dto/set-user-role.dto.js';
import { AuthService } from '../auth/auth.service.js';
import { UsersService } from '../users/users.service.js';

@Controller('tours')
export class ToursController {
  constructor(
    private readonly toursService: ToursService,
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @Post()
  create(
    @Body() body: CreateTourDto,
    @Headers('authorization') authHeader?: string,
  ) {
    const user = this.authService.extractUserFromHeader(authHeader);
    return this.toursService.create(body, user?.id);
  }

  @Get('my-tours')
  findUserTours(@Headers('authorization') authHeader?: string) {
    const user = this.authService.extractUserFromHeader(authHeader);
    if (!user) {
      throw new UnauthorizedException('Nicht authentifiziert.');
    }
    return this.toursService.findUserTours(user.id);
  }

  @Get(':id')
  async findById(
    @Param('id') id: string,
    @Headers('authorization') authHeader?: string,
  ) {
    const user = this.authService.extractUserFromHeader(authHeader);
    if (!user) {
      throw new UnauthorizedException('Nicht authentifiziert.');
    }

    const tour = await this.toursService.findById(id);

    if (!tour) {
      throw new NotFoundException('Tour wurde nicht gefunden.');
    }

    return tour;
  }

  @Post(':tourId/join')
  async joinTour(
    @Param('tourId') tourId: string,
    @Headers('authorization') authHeader?: string,
  ) {
    const user = this.authService.extractUserFromHeader(authHeader);
    if (!user) {
      throw new UnauthorizedException('Bitte zuerst anmelden.');
    }

    const existingTour = await this.toursService.findById(tourId);
    if (!existingTour) {
      throw new NotFoundException('Tour wurde nicht gefunden.');
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
    @Headers('authorization') authHeader?: string,
  ) {
    const user = this.authService.extractUserFromHeader(authHeader);
    if (!user) {
      throw new UnauthorizedException('Nicht authentifiziert.');
    }

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
    @Headers('authorization') authHeader?: string,
  ) {
    const user = this.authService.extractUserFromHeader(authHeader);
    if (!user) {
      throw new UnauthorizedException('Nicht authentifiziert.');
    }

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
    @Headers('authorization') authHeader?: string,
  ) {
    const role = body.role;
    const user = this.authService.extractUserFromHeader(authHeader);

    if (!user) {
      throw new UnauthorizedException('Nicht authentifiziert.');
    }

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
    @Headers('authorization') authHeader?: string,
  ) {
    const user = this.authService.extractUserFromHeader(authHeader);

    if (!user) {
      throw new UnauthorizedException('Nicht authentifiziert.');
    }

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
