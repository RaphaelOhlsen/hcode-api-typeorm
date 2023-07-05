import { forwardRef, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { FileModule } from 'src/file/file.module';
import { UserModule } from 'src/user/user.module';
import { AuthControler } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET,
    }),
    forwardRef(() => UserModule),
    PrismaModule,
    FileModule,
  ],
  controllers: [AuthControler],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
