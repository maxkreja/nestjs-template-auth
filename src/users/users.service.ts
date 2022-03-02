import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from '../authentication/dto/create-user.dto';
import { UserEntity } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly users: Repository<UserEntity>,
  ) {}

  async findById(id: string) {
    return this.users.findOne({ id });
  }

  async findByUsername(username: string) {
    return this.users.findOne({ username });
  }

  async create(body: CreateUserDto) {
    const { username, password } = body;

    const user = await this.users.create({ username, password });
    await this.users.save(user);

    return user;
  }
}
