import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserSigninDto } from './dto/signin-user.dto';
import { UserSignupDto } from './dto/signup-user.dto';
import {
  ResponseError,
  ResponseSuccess,
} from 'src/shared/common/dto/response.dto';
import { IResponse } from 'src/shared/common/interfaces/response.interface';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signin')
  @HttpCode(HttpStatus.OK)
  async signin(@Body() UserSigninDto: UserSigninDto): Promise<IResponse> {
    try {
      const user = await this.authService.signin(UserSigninDto);
      console.log(user);
      return new ResponseSuccess('LOGIN_SUCCESS', user);
    } catch (err) {
      return new ResponseError('LOGIN.ERROR ', err);
    }
  }

  @Post('signup')
  @HttpCode(HttpStatus.OK)
  async signup(@Body() userSignupDto: UserSignupDto): Promise<IResponse> {
    try {
      const user = await this.authService.signup(userSignupDto);
      return new ResponseSuccess('SIGNUP.SUCCESS');
    } catch (err) {
      return new ResponseError('SIGNUP.ERROR ', err);
    }
  }
}
