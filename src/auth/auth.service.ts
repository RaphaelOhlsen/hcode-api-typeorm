import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserService } from 'src/user/user.service';
import { AuthRegisterDto } from './dto/auth-register.dto';

@Injectable()
export class AuthService {
  private issuer = 'login';
  private audience = 'users';

  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
    private readonly mailer: MailerService,
  ) {}

  createToken(user: User) {
    const token = this.jwtService.sign(
      {
        id: user.id,
        mane: user.name,
        email: user.email,
      },
      {
        expiresIn: '7 days',
        subject: String(user.id),
        issuer: this.issuer,
        audience: this.audience,
      },
    );
    return { accessToken: token };
  }

  checkToken(token: string) {
    try {
      const data = this.jwtService.verify(token, {
        issuer: this.issuer,
        audience: this.audience,
      });
      return data;
    } catch (error) {
      throw new BadRequestException('Invalid credentials');
    }
  }

  isValidToken(token: string) {
    try {
      this.checkToken(token);
      return true;
    } catch (error) {
      return false;
    }
  }

  async login(email: string, password: string) {
    const user = await this.prisma.user.findFirst({
      where: { email },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return this.createToken(user);
  }

  async forget(email: string) {
    const user = await this.prisma.user.findFirst({ where: { email } });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const token = this.jwtService.sign(
      { id: user.id },
      {
        expiresIn: '120 minutes',
        subject: String(user.id),
        issuer: 'forget',
        audience: 'users',
      },
    );

    console.log('TOKEN', token);

    const res = await this.mailer.sendMail({
      subject: 'Reset password',
      to: user.email,
      template: 'forget',
      context: {
        name: user.name,
        token,
      },
    });

    console.log(res);

    return true;
  }

  async reset(token: string, password: string) {
    console.log('TOKEN', token);
    console.log('PASSWORD', password);
    try {
      const data = this.jwtService.verify(token, {
        issuer: 'forget',
        audience: 'users',
      });

      const id = Number(data.id);

      if (isNaN(id)) {
        throw new BadRequestException('Invalid credentials');
      }

      password = await bcrypt.hash(password, 10);

      const user = await this.prisma.user.update({
        where: { id },
        data: { password },
      });

      return this.createToken(user);
    } catch (error) {
      throw new BadRequestException('Invalid credentials');
    }
  }

  async register(data: AuthRegisterDto) {
    const user = await this.userService.create(data);

    return this.createToken(user);
  }
}
