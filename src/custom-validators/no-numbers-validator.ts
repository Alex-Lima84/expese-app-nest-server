import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';

@ValidatorConstraint({ name: 'noNumbers', async: false })
export class NoNumbersValidator implements ValidatorConstraintInterface {
  validate(text: string) {
    return !/\d/.test(text);
  }

  defaultMessage(args: ValidationArguments) {
    return `${args.property} cannot contain numbers`;
  }
}
