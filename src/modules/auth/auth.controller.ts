import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Post,
} from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { Services } from 'src/enums';
import { LoginUserDto, RegisterUserDto } from './dto';
import { firstValueFrom } from 'rxjs';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(
    @Inject(Services.NATS_SERVICE) private readonly client: ClientProxy,
  ) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiCreatedResponse({ description: 'User registered successfully' })
  @ApiBadRequestResponse({ description: 'User with this email already exists' })
  async registerUser(@Body() registerUser: RegisterUserDto) {
    try {
      return await firstValueFrom(
        this.client.send('authRegister', registerUser),
      );
    } catch (error) {
      throw new RpcException(error);
    }
  }

  @Post('login')
  @ApiOperation({ summary: 'Login a user' })
  @ApiOkResponse({ description: 'User logged in successfully' })
  @ApiUnauthorizedResponse({ description: 'Invalid credentials' })
  @HttpCode(HttpStatus.OK)
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
