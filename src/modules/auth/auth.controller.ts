import { Body, Controller, Get, Inject, Post } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { Services } from 'src/enums';
import { LoginUserDto, RegisterUserDto } from './dto';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(
    @Inject(Services.NATS_SERVICE) private readonly client: ClientProxy,
  ) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  async registerUser(@Body() registerUser: RegisterUserDto) {
    return this.client.send('auth.register.user', registerUser);
  }

  @Post('login')
  async loginUser(@Body() loginUser: LoginUserDto) {
    return this.client.send('auth.login.user', loginUser);
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
