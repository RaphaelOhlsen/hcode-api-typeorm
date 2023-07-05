import { Injectable, NotFoundException } from '@nestjs/common';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePatchUserDto } from './dto/update-patch-user.dto';
import { UpdatePutUserDto } from './dto/update-put-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  private async checkUserExists(id: number) {
    const exist = await this.prisma.user.count({ where: { id } });
    if (!exist) {
      throw new NotFoundException(`User #${id} not found`);
    }
  }

  async create(data: CreateUserDto) {
    data.password = await bcrypt.hash(data.password, 10);
    return this.prisma.user.create({ data });
  }

  async list() {
    return this.prisma.user.findMany();
  }

  async show(id: number) {
    await this.checkUserExists(id);
    return this.prisma.user.findUnique({ where: { id } });
  }

  async update(
    id: number,
    { email, name, password, birthDate, role }: UpdatePutUserDto,
  ) {
    await this.checkUserExists(id);

    password = await bcrypt.hash(password, 10);

    return this.prisma.user.update({
      where: { id },
      data: {
        name,
        email,
        password,
        birthDate: birthDate ? new Date(birthDate) : null,
        role,
      },
    });
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

    return this.prisma.user.update({ where: { id }, data });
  }

  async delete(id: number) {
    await this.checkUserExists(id);
    return this.prisma.user.delete({ where: { id } });
  }
}
