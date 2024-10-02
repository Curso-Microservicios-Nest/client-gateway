import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { firstValueFrom } from 'rxjs';
import { Services } from 'src/enums';
import { Token, User } from './decorators';
import { LoginUserDto, RegisterUserDto } from './dto';
import { JwtAuthGuard } from './guards';
import { CurrentUser } from './interfaces/current-user.interface';

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

  @UseGuards(JwtAuthGuard)
  @Get('verify')
  @ApiOperation({ summary: 'Verify user' })
  @ApiOkResponse({ description: 'User verified successfully' })
  @ApiUnauthorizedResponse({ description: 'Invalid token' })
  @ApiBearerAuth()
  async verifyUser(@User() user: CurrentUser, @Token() token: string) {
    return this.client.send('auth.verify.user', token);
  }
}
