import { IsJWT, IsNotEmpty, IsStrongPassword } from 'class-validator';

export class AuthResetDto {
  @IsNotEmpty()
  @IsStrongPassword({
    minLength: 6,
    minLowercase: 0,
    minUppercase: 0,
    minNumbers: 0,
    minSymbols: 0,
  })
  password: string;

  @IsNotEmpty()
  @IsJWT()
  token: string;
}
