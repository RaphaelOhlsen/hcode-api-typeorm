import { Role } from '../enums/role.enum';
import { UpdatePutUserDto } from '../user/dto/update-put-user.dto';

export const updatePutUserDto: UpdatePutUserDto = {
  name: 'Rafael',
  email: 'raphael@teste.com',
  birthDate: '1990-02-09',
  password: '$2b$10$TQMZHY/NE.unfuUqYTWZqe4ENEsjCm8rt4Xs9Fb/6.FIKy4AW/M/O',
  role: Role.User,
};
