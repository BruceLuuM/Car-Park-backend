import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class UserSigninDto {
  @IsNotEmpty({ message: 'Username cannot be empty' })
  @IsString({ message: 'Username should be string' })
  username: string;

  @IsNotEmpty({ message: 'Password cannot be empty' })
  @MinLength(5, { message: 'Password minimum length must be 5' })
  password: string;
}
