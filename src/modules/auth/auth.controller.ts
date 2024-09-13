import { Controller, Get, Post } from '@nestjs/common';

@Controller('auth')
export class AuthController {
  constructor() {}

  @Post('register')
  async registerUser() {
    return 'User registered';
  }

  @Post('login')
  async loginUser() {
    return 'User logged in';
  }

  @Post('logout')
  async logoutUser() {
    return 'User logged out';
  }

  @Get('verify')
  async verifyUser() {
    return 'User verified';
  }
}
