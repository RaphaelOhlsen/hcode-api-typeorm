import { Role } from '../enums/role.enum';
import { UserEntity } from '../user/entity/user.entity';

export const userEntityList: UserEntity[] = [
  {
    id: 1,
    name: 'Raphael',
    email: 'raphael@teste.com',
    birth_date: new Date('1990-02-09'),
    password: '$2b$10$TQMZHY/NE.unfuUqYTWZqe4ENEsjCm8rt4Xs9Fb/6.FIKy4AW/M/O',
    role: Role.Admin,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: 2,
    name: 'Joao',
    email: 'joao@teste.com',
    birth_date: new Date('1990-02-09'),
    password: '$2b$10$TQMZHY/NE.unfuUqYTWZqe4ENEsjCm8rt4Xs9Fb/6.FIKy4AW/M/O',
    role: Role.Admin,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: 3,
    name: 'Maria',
    email: 'maria@teste.com',
    birth_date: new Date('1990-02-09'),
    password: '$2b$10$TQMZHY/NE.unfuUqYTWZqe4ENEsjCm8rt4Xs9Fb/6.FIKy4AW/M/O',
    role: Role.Admin,
    created_at: new Date(),
    updated_at: new Date(),
  },
];
