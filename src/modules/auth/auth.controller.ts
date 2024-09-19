import { Controller, Get, Inject, Post } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { Services } from 'src/enums';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(
    @Inject(Services.NATS_SERVICE) private readonly client: ClientProxy,
  ) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  async registerUser() {
    return this.client.send('auth.register.user', {});
  }

  @Post('login')
  async loginUser() {
    return this.client.send('auth.login.user', {});
  }

  @Post('logout')
  async logoutUser() {
    return this.client.send('auth.logout.user', {});
  }

  @Get('verify')
  async verifyUser() {
    return this.client.send('auth.verify.user', {});
  }
}
