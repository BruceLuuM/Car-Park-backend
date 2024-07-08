import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
  MinLength,
} from 'class-validator';
// Base DTO excluding username
export class BaseUserDto {
  @IsOptional()
  id: number;

  @IsOptional()
  @MinLength(6, { message: 'Password minimum length must be 56' })
  password: string;

  @IsOptional()
  full_name: string;

  @IsNotEmpty({ message: 'Email cannot be empty' })
  @IsEmail()
  email: string;

  @IsOptional()
  @IsPhoneNumber()
  phone: string;
}
