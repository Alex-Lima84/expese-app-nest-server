import { Controller, Post, Body, Get } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signin')
  async signin(
    @Body()
    body: {
      email: string;
      firstName: string;
      lastName: string;
      password: string;
    },
  ): Promise<any> {
    const { email, firstName, lastName, password } = body;
    return this.authService.signin(email, firstName, lastName, password);
  }

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
