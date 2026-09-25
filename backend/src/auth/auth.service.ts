import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service.js';
import { LoginDto } from './dto/login.dto.js';
import { RegisterDto } from './dto/register.dto.js';
import { TokenPayload } from './auth.utils.js';

export interface AuthResult {
  token: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
}

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto): Promise<AuthResult> {
    const email = loginDto.email?.toLowerCase().trim();
    if (!email || !loginDto.password) {
      throw new BadRequestException('E-Mail und Passwort sind erforderlich.');
    }

    const userDoc = await this.usersService.findByEmail(email);
    if (!userDoc || !userDoc.passwordHash) {
      throw new UnauthorizedException('Ungültige E-Mail-Adresse oder Passwort.');
    }

    const isValid = await bcrypt.compare(loginDto.password, userDoc.passwordHash);
    if (!isValid) {
      throw new UnauthorizedException('Ungültige E-Mail-Adresse oder Passwort.');
    }

    const payload: TokenPayload = {
      id: userDoc.id,
      email: userDoc.email ?? '',
      firstName: userDoc.firstName,
      lastName: userDoc.lastName,
    };

    const token = this.jwtService.sign(payload);

    return {
      token,
      user: {
        id: userDoc.id,
        firstName: userDoc.firstName,
        lastName: userDoc.lastName,
        email: userDoc.email ?? '',
      },
    };
  }

  async register(registerDto: RegisterDto): Promise<AuthResult> {
    const email = registerDto.email?.toLowerCase().trim();
    if (!email || !registerDto.password || !registerDto.firstName || !registerDto.lastName) {
      throw new BadRequestException('Name, E-Mail und Passwort sind erforderlich.');
    }

    if (registerDto.password.length < 6) {
      throw new BadRequestException('Das Passwort muss mindestens 6 Zeichen lang sein.');
    }

    const existingUser = await this.usersService.findByEmail(email);
    if (existingUser) {
      throw new BadRequestException('Diese E-Mail-Adresse wird bereits verwendet.');
    }

    const passwordHash = await bcrypt.hash(registerDto.password, 10);
    const createdUser = await this.usersService.create({
      firstName: registerDto.firstName,
      lastName: registerDto.lastName,
      email,
      passwordHash,
      birthday: registerDto.birthday ?? '',
      emergencyContact: registerDto.emergencyContact
        ? {
            firstName: registerDto.emergencyContact.firstName?.trim() ?? '',
            lastName: registerDto.emergencyContact.lastName?.trim() ?? '',
            phoneNumber: registerDto.emergencyContact.phoneNumber?.trim() ?? '',
            relationship: registerDto.emergencyContact.relationship?.trim() ?? '',
          }
        : undefined,
    });

    const payload: TokenPayload = {
      id: createdUser.id,
      email: createdUser.email ?? email,
      firstName: createdUser.firstName,
      lastName: createdUser.lastName,
    };

    const token = this.jwtService.sign(payload);

    return {
      token,
      user: {
        id: createdUser.id,
        firstName: createdUser.firstName,
        lastName: createdUser.lastName,
        email: createdUser.email ?? email,
      },
    };
  }
}
