import { Test, TestingModule } from '@nestjs/testing';
import { AuthGuard } from '../guards/auth.guard';
import { accessToken } from '../testing/access-token.mock';
import { authForgetDto } from '../testing/auth-forget-dto.mock';
import { authLoginDto } from '../testing/auth-login-dto.mock';
import { authRegisterDto } from '../testing/auth-register-dto.mock';
import { authResetDto } from '../testing/auth-reset-dto.mock';
import { authServiceMock } from '../testing/auth-service.mock';
import { createUserDTO } from '../testing/create-user-dto.mock';
import { FileServiceMock } from '../testing/file-service.mock';
import { getPhoto } from '../testing/get-photo.mock';
import { guardMock } from '../testing/guard.mock';
import { userEntityList } from '../testing/user-entity-list.mock';
import { AuthController } from './auth.controller';

describe('AuthController', () => {
  let authController: AuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [authServiceMock, FileServiceMock],
    })
      .overrideGuard(AuthGuard)
      .useValue(guardMock)
      .compile();

    authController = module.get<AuthController>(AuthController);
  });

  test('should be defined', () => {
    expect(authController).toBeDefined();
  });

  describe('Authentication Flow', () => {
    test('should login', async () => {
      const result = await authController.login(authLoginDto);
      expect(result).toEqual({ accessToken });
    });

    test('should register', async () => {
      const result = await authController.register(authRegisterDto);
      expect(result).toEqual({ accessToken });
    });

    test('should user use forget method', async () => {
      const result = await authController.forget(authForgetDto);
      expect(result).toEqual({ success: true });
    });

    test('should user reset password', async () => {
      const result = await authController.reset(authResetDto);
      expect(result).toEqual({ accessToken });
    });
  });

  describe('Authenticated routes', () => {
    test('should return user', async () => {
      const result = await authController.me(createUserDTO);
      expect(result).toEqual(createUserDTO);
    });

    test('should upload photo', async () => {
      const photo = await getPhoto();
      const result = await authController.uploadPhoto(userEntityList[0], photo);
      expect(result).toEqual(photo);
    });
  });
});
