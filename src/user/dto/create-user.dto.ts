import { IsOptional, IsString } from 'class-validator';
import { BaseUserDto } from './base-user.dto';

export class CreateUserDto extends BaseUserDto {
  @IsOptional({ message: 'Username cannot be empty' })
  @IsString({ message: 'Username should be string' })
  username: string;
}
