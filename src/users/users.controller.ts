import {
  Controller,
  Get,
  Param,
  UseGuards,
  Req,
  ForbiddenException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../jwt-guard/jwt-auth.guard';
import { Request } from 'express';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get(':userEmail')
  @UseGuards(JwtAuthGuard)
  async getUserInfo(
    @Param('userEmail') userEmail: string,
    @Req() req: Request,
  ): Promise<any> {
    if (userEmail !== req['userEmail']) {
      throw new ForbiddenException('Forbidden');
    }

    const userInfo = await this.usersService.getUserInfo(userEmail);
    return userInfo;
  }
}
