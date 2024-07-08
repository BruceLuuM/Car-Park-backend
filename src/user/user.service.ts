import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserEntity } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { hashPassword } from 'src/shared/helpers/security/bcrypt/encryption';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
  ) {}
  async create(createUserDto: CreateUserDto) {
    // uncomment the following line if you enable unique email addresses

    const userCreate = new UserEntity();
    userCreate.username = createUserDto.username;
    userCreate.password = await hashPassword(createUserDto.password);
    userCreate.full_name = createUserDto.full_name;
    userCreate.email = createUserDto.email;
    userCreate.phone = createUserDto.phone;

    let user = this.usersRepository.create(userCreate);
    user = await this.usersRepository.save(user);
    delete user.password;
    return user;
  }

  async findUser(username: string) {
    try {
      const user = await this.usersRepository
        .createQueryBuilder('users')
        .select()
        .where('users.username = :username', { username: username })
        .getOne();

      if (!user) throw new NotFoundException('Không tìm được user');
      return user;
    } catch (err) {
      console.log(err);
    }
  }

  async findOne(id: number): Promise<UserEntity> {
    try {
      const user = await this.usersRepository
        .createQueryBuilder('users')
        .select([
          'users.id',
          'users.username',
          'users.full_name',
          'users.email',
          'users.phone',
          'users.createdAt',
          'users.role',
        ])
        .where('users.id = :id', { id })
        .orderBy('users.id', 'DESC')
        .getOne();

      if (!user) throw new NotFoundException('Không tìm được user');
      return user;
    } catch (err) {
      console.log(err);
    }
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<UserEntity> {
    const user = await this.findOne(id);

    const allowedFields = ['username', 'full_name', 'email', 'phone'];

    Object.keys(updateUserDto)
      .filter((key) => allowedFields.includes(key))
      .forEach((key) => {
        if (updateUserDto[key] !== null) {
          user[key] = updateUserDto[key];
        }
      });
    if (updateUserDto.password) {
      user.password = await hashPassword(updateUserDto.password);
    }
    user.updatedAt = new Date();
    // Save changes and return updated user (excluding password)
    const updatedUser = await this.usersRepository.save(user);
    delete updatedUser.password;
    return await this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.usersRepository
      .createQueryBuilder()
      .delete()
      .where('id=:id', { id: id })
      .execute();
  }
}
