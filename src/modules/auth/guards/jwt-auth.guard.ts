import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ClientProxy } from '@nestjs/microservices';
import { IncomingMessage } from 'http';

import { firstValueFrom } from 'rxjs';
import { Services } from 'src/enums';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    @Inject(Services.NATS_SERVICE) private readonly client: ClientProxy,
  ) {}

  async canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.get(IS_PUBLIC_KEY, context.getHandler());
    // Si tiene el decorador @Public, no se requiere autenticación
    if (isPublic) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException('Token not found');
    }
    try {
      // Verfica el token para los endpoints que requieren autenticación
      const { user, token: newToken } = await firstValueFrom(
        this.client.send('auth.verify.user', token),
      );
      // Cargar el usuario y el token en la request
      request.user = user;
      request.token = newToken;
    } catch {
      throw new UnauthorizedException();
    }
    return true;
  }

  private extractTokenFromHeader(request: IncomingMessage): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
