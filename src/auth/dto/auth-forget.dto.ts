import { IsNotEmpty, IsString } from 'class-validator';

export class AuthForgetDto {
  @IsNotEmpty()
  @IsString()
  email: string;
}
