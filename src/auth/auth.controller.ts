import { Controller, Post, Body, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SigninDto } from './dtos/signin.dto';
import { LoginDto } from './dtos/login.dto';

@Controller('')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signin')
  async signin(@Body() signinDto: SigninDto): Promise<any> {
    return this.authService.signin(
      signinDto.email,
      signinDto.firstName,
      signinDto.lastName,
      signinDto.password,
    );
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto): Promise<any> {
    return this.authService.login(loginDto.email, loginDto.password);
  }

  // @Get('test')
  // async testConnection(): Promise<string> {
  //   return this.authService.testConnection();
  // }
}
