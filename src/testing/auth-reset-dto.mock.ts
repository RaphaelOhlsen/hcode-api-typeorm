import { AuthResetDto } from '../auth/dto/auth-reset.dto';
import { resetToken } from './reset-token.mock';

export const authResetDto: AuthResetDto = {
  token: resetToken,
  password: '123456',
};
