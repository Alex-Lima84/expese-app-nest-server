import { IsEmail, IsString, MinLength, Validate } from 'class-validator';
import { NoNumbersValidator } from 'src/custom-validators/no-numbers-validator';

export class SigninDto {
  @IsEmail()
  email: string;

  @IsString()
  @Validate(NoNumbersValidator)
  firstName: string;

  @IsString()
  @Validate(NoNumbersValidator)
  lastName: string;

  @IsString()
  @MinLength(8)
  password: string;
}
