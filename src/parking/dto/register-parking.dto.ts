import { IsString, IsDate } from 'class-validator';

export class RegisterDto {
  @IsString()
  name: string;

  @IsString()
  code: string;

  @IsString()
  cardId: string;

  @IsString()
  numberPlate: string;

  @IsString()
  type: string;
}
