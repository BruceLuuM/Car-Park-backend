import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { UserEntity } from 'src/user/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserSigninDto } from './dto/signin-user.dto';
import { hash, compare } from 'bcrypt';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,

    private userService: UserService,
  ) {}

  async signin(userSigninDto: UserSigninDto): Promise<UserEntity> {
    const userExists = await this.usersRepository
      .createQueryBuilder('users')
      .addSelect('users.password')

      .where('BINARY users.username=:username', {
        username: userSigninDto.username,
      })
      .getOne();
    const user = await this.usersRepository.findOne({
      where: { id: userExists.id },
    });
    if (!userExists) throw new BadRequestException('User không tồn tại');

    const matchPassword = await compare(
      userSigninDto.password,
      userExists.password,
    );
    if (!matchPassword) throw new BadRequestException('Sai mật khẩu');
    delete userExists.password;
    return userExists;
  }

  async signup(createUserDto: CreateUserDto) {
    const usernameExists = await this.usersRepository
      .createQueryBuilder('users')
      .where('users.username=:username', { username: createUserDto.username })
      .getOne();

    if (usernameExists)
      throw new BadRequestException('Tên đăng nhập đã tồn tại');

    const emailExists = await this.usersRepository
      .createQueryBuilder('users')
      .where('users.email=:email', { email: createUserDto.email })
      .getOne();

    if (emailExists) throw new BadRequestException('Email đã tồn tại');
    const user = await this.userService.create(createUserDto);
  }
}
