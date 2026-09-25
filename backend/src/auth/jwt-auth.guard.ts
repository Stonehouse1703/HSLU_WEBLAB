import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { extractUserFromHeader } from './auth.utils.js';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers['authorization'] as string | undefined;
    const user = extractUserFromHeader(authHeader);

    if (!user) {
      throw new UnauthorizedException('Nicht authentifiziert.');
    }

    request.user = user;
    return true;
  }
}
