import { Controller, Post, Body, Get } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() body: { email: string; password: string }): Promise<any> {
    const { email, password } = body;
    return this.authService.login(email, password);
  }

  @Get('test')
  async testConnection(): Promise<string> {
    return this.authService.testConnection();
  }
}
