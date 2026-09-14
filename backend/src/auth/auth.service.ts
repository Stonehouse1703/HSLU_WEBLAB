import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService, User } from '../users/users.service.js';
import { LoginDto } from './dto/login.dto.js';
import { RegisterDto } from './dto/register.dto.js';
import {
  generateToken,
  hashPassword,
  TokenPayload,
  verifyPassword,
  verifyToken,
} from './auth.utils.js';

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
  constructor(private readonly usersService: UsersService) {}

  async login(loginDto: LoginDto): Promise<AuthResult> {
    const email = loginDto.email?.toLowerCase().trim();
    if (!email || !loginDto.password) {
      throw new BadRequestException('E-Mail und Passwort sind erforderlich.');
    }

    const userDoc = await this.usersService.findByEmail(email);
    if (!userDoc || !userDoc.passwordHash) {
      throw new UnauthorizedException('Ungültige E-Mail-Adresse oder Passwort.');
    }

    const isValid = verifyPassword(loginDto.password, userDoc.passwordHash);
    if (!isValid) {
      throw new UnauthorizedException('Ungültige E-Mail-Adresse oder Passwort.');
    }

    const payload: TokenPayload = {
      id: userDoc.id,
      email: userDoc.email ?? '',
      firstName: userDoc.firstName,
      lastName: userDoc.lastName,
    };

    const token = generateToken(payload);

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

    const passwordHash = hashPassword(registerDto.password);
    const createdUser = await this.usersService.create({
      firstName: registerDto.firstName,
      lastName: registerDto.lastName,
      email,
      passwordHash,
      birthday: registerDto.birthday ?? '',
      phoneNumber: registerDto.phoneNumber ?? '',
      emergencyContact: registerDto.emergencyContact,
    });

    const payload: TokenPayload = {
      id: createdUser.id,
      email: createdUser.email ?? email,
      firstName: createdUser.firstName,
      lastName: createdUser.lastName,
    };

    const token = generateToken(payload);

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

  extractUserFromHeader(authHeader?: string): TokenPayload | null {
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }
    const token = authHeader.substring(7).trim();
    return verifyToken(token);
  }
}
