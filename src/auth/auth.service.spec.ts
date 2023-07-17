import { Test, TestingModule } from '@nestjs/testing';
import { accessToken } from '../testing/access-token.mock';
import { authRegisterDto } from '../testing/auth-register-dto.mock';
import { jwtPayload } from '../testing/jwt-payload.mock';
import { jwtServiceMock } from '../testing/jwt-service.mock';
import { mailerServiceMock } from '../testing/mailer-service.mock';
import { resetToken } from '../testing/reset-token.mock';
import { userEntityList } from '../testing/user-entity-list.mock';
import { userRepositoryMock } from '../testing/user-repository.mock';
import { userServiceMock } from '../testing/user-service.mock';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        userRepositoryMock,
        jwtServiceMock,
        userServiceMock,
        mailerServiceMock,
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
  });

  test('should be defined', () => {
    expect(authService).toBeDefined();
  });

  describe('Token', () => {
    test('should create a token', () => {
      const result = authService.createToken(userEntityList[0]);
      expect(result).toEqual({
        accessToken,
      });
    });

    test('should verify a token', () => {
      const result = authService.checkToken(accessToken);
      expect(result).toEqual(jwtPayload);
    });

    test('should verify if a token is valid', () => {
      const result = authService.isValidToken(accessToken);
      expect(result).toEqual(true);
    });
  });

  describe('Authentication', () => {
    test('should login a user', async () => {
      const result = await authService.login(
        'raphael@teste.com',
        '@Ggqt123252',
      );
      expect(result).toEqual({ accessToken });
    });

    test('should execute forget password process', async () => {
      const result = await authService.forget('raphael@teste.com');
      expect(result).toEqual({ success: true });
    });

    test('should reset a password', async () => {
      const result = await authService.reset(resetToken, '@Ggqt12325-');
      expect(result).toEqual({ accessToken });
    });

    test('should register a user', async () => {
      const result = await authService.register(authRegisterDto);
      expect(result).toEqual({ accessToken });
    });
  });
});
