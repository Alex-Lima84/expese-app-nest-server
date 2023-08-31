import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { UserDto } from './user.dto';

@Injectable()
export class UserParamValidationPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    const userDto = new UserDto();
    userDto.userEmail = value;
    return userDto;
  }
}
