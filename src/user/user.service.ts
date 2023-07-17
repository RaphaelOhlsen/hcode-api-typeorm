import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePatchUserDto } from './dto/update-patch-user.dto';
import { UpdatePutUserDto } from './dto/update-put-user.dto';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { UserEntity } from './entity/user.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
  ) {}

  private async checkUserExists(id: number) {
    const exist = await this.usersRepository.exist({ where: { id } });

    if (!exist) {
      throw new NotFoundException(`User #${id} not found`);
    }
  }

  async create(data: CreateUserDto) {
    const isEmailExist = await this.usersRepository.exist({
      where: { email: data.email },
    });

    if (isEmailExist) {
      throw new BadRequestException('Email already exists');
    }

    data.password = await bcrypt.hash(data.password, 10);
    const user = this.usersRepository.create(data);
    return this.usersRepository.save(user);
  }

  async list() {
    return this.usersRepository.find();
  }

  async show(id: number) {
    await this.checkUserExists(id);
    return this.usersRepository.findOne({ where: { id } });
  }

  async update(
    id: number,
    { email, name, password, birthDate, role }: UpdatePutUserDto,
  ) {
    await this.checkUserExists(id);

    password = await bcrypt.hash(password, 10);

    await this.usersRepository.update(id, {
      name,
      email,
      password,
      birth_date: birthDate ? new Date(birthDate) : null,
      role,
    });

    return this.show(id);
  }

  async updatePartial(
    id: number,
    { name, email, password, birthDate, role }: UpdatePatchUserDto,
  ) {
    await this.checkUserExists(id);
    const data: any = {};
    if (name) {
      data.name = name;
    }
    if (email) {
      data.email = email;
    }
    if (password) {
      data.password = await bcrypt.hash(password, 10);
    }
    if (birthDate) {
      data.birthDate = new Date(birthDate);
    }

    if (role) {
      data.role = role;
    }

    await this.usersRepository.update(id, data);

    return this.show(id);
  }

  async delete(id: number) {
    await this.checkUserExists(id);
    await this.usersRepository.delete(id);
    return true;
  }
}
