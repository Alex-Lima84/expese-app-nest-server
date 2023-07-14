import {
  Controller,
  Get,
  Param,
  UseGuards,
  Req,
  InternalServerErrorException,
  ForbiddenException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../jwt-guard/jwt-auth.guard';
import { Request } from 'express';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Get(':userEmail')
  @UseGuards(JwtAuthGuard)
  async getUserInfo(
    @Param('userEmail') userEmail: string,
    @Req() req: Request,
  ): Promise<any> {
    if (userEmail !== req['userEmail']) {
      throw new ForbiddenException('Forbidden');
    }

    try {
      const userInfo = await this.userService.getUserInfo(userEmail);
      return userInfo;
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(
        'An error occurred while retrieving user information',
      );
    }
  }
}
