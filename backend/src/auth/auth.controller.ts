import {
  Body,
  Controller,
  Get,
  Headers,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { LoginDto } from './dto/login.dto.js';
import { RegisterDto } from './dto/register.dto.js';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  login(@Body() body: LoginDto) {
    return this.authService.login(body);
  }

  @Post('register')
  register(@Body() body: RegisterDto) {
    return this.authService.register(body);
  }

  @Get('me')
  getProfile(@Headers('authorization') authHeader?: string) {
    const user = this.authService.extractUserFromHeader(authHeader);
    if (!user) {
      throw new UnauthorizedException('Nicht authentifiziert.');
    }
    return user;
  }
}
