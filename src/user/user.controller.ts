import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserEntity } from './entities/user.entity';
import { AuthenticationGuard } from 'src/shared/guards/authentications.guard';
import { CurrentUser } from 'src/shared/decorators/current-user.decorator';
import {
  ResponseError,
  ResponseSuccess,
} from 'src/shared/common/dto/response.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async create(
    @Body() createUserDto: CreateUserDto,
  ): Promise<{ user: UserEntity }> {
    return { user: await this.userService.create(createUserDto) };
  }

  @UseGuards(AuthenticationGuard)
  @Patch('update')
  async update_current_user(
    @CurrentUser() currentUser: UserEntity,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    const updatedUser = await this.userService.update(
      currentUser.id,
      updateUserDto,
    );
    try {
      return new ResponseSuccess('UPDATE_USER.SUCCESS', updatedUser);
    } catch (error) {
      return new ResponseError('UPDATE_USER.ERROR ', error);
    }
  }
}
