import { IsEmail, IsNotEmpty, IsOptional } from 'class-validator';
import { UserSigninDto } from './signin-user.dto';

export class UserSignupDto extends UserSigninDto {
  id: number;

  @IsNotEmpty({ message: 'full_name cannot be empty' })
  full_name: string;

  @IsNotEmpty({ message: 'Email cannot be empty' })
  email: string;

  @IsNotEmpty({ message: 'phone number cannot be empty' })
  phone: string;

  // @
  // @ApiProperty()
  // @IsOptional()
  // roles: Roles;
}
