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
import { UserDto } from './dtos/user.dto';
import { UserParamValidationPipe } from './dtos/user-param-validation.pipe';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get(':userEmail')
  @UseGuards(JwtAuthGuard)
  async getUserInfo(
    @Param('userEmail', UserParamValidationPipe) userDto: UserDto,
    @Req() req: Request,
  ): Promise<any> {
    if (userDto.userEmail !== req['userEmail']) {
      throw new ForbiddenException('Forbidden');
    }

    const userInfo = await this.usersService.getUserInfo(userDto.userEmail);
    return userInfo;
  }
}
