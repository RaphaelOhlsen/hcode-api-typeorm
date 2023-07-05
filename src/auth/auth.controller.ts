import {
  BadRequestException,
  Body,
  Controller,
  FileTypeValidator,
  MaxFileSizeValidator,
  ParseFilePipe,
  Post,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';

import {
  FileFieldsInterceptor,
  FileInterceptor,
} from '@nestjs/platform-express';
import { join } from 'path';

import { AuthForgetDto } from './dto/auth-forget.dto';
import { AuthResetDto } from './dto/auth-reset.dto';
import { AuthLoginDto } from './dto/auth-login.dto';
import { AuthRegisterDto } from './dto/auth-register.dto';
import { UserService } from 'src/user/user.service';
import { AuthService } from './auth.service';
import { AuthGuard } from 'src/guards/auth.guard';
import { User } from 'src/decorators/user.decorator';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { FileService } from 'src/file/file.service';

@Controller('auth')
export class AuthControler {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
    private readonly fileService: FileService,
  ) {}

  @Post('login')
  async login(@Body() { email, password }: AuthLoginDto) {
    return this.authService.login(email, password);
  }

  @Post('register')
  async register(@Body() body: AuthRegisterDto) {
    return this.authService.register(body);
  }

  @Post('forget')
  async forget(@Body() { email }: AuthForgetDto) {
    return this.authService.forget(email);
  }

  @Post('reset')
  async reset(@Body() { token, password }: AuthResetDto) {
    return this.authService.reset(token, password);
  }

  @UseGuards(AuthGuard)
  @Post('me')
  async me(@User(['name', 'email', 'password', 'role']) user: CreateUserDto) {
    return { user };
  }

  @UseInterceptors(FileInterceptor('file'))
  @UseGuards(AuthGuard)
  @Post('photo')
  async uploadPhoto(
    @User() user,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new FileTypeValidator({ fileType: '.(jpeg|png)' }),
          new MaxFileSizeValidator({ maxSize: 1024 * 100000 }),
        ],
      }),
    )
    photo: Express.Multer.File,
  ) {
    const path = join(
      __dirname,
      '..',
      '..',
      'storage',
      'photos',
      `potho-${user.id}.png`,
    );

    try {
      await this.fileService.upload(photo, path);
    } catch (error) {
      throw new BadRequestException(error.message);
    }

    return { success: true };
  }

  @Post('upload')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'avatar', maxCount: 2 },
      { name: 'photo', maxCount: 5 },
    ]),
  )
  uploadFile(
    @UploadedFiles()
    files: {
      avatar?: Express.Multer.File;
      photo?: Express.Multer.File[];
    },
  ) {
    console.log(Array.isArray(files));
  }
}
