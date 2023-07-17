import { Test, TestingModule } from '@nestjs/testing';
import { AuthGuard } from '../guards/auth.guard';
import { RoleGuard } from '../guards/role.guard';
import { guardMock } from '../testing/guard.mock';
import { userServiceMock } from '../testing/user-service.mock';

import { UserController } from './user.controller';
import { UserService } from './user.service';
import { createUserDTO } from '../testing/create-user-dto.mock';
import { userEntityList } from '../testing/user-entity-list.mock';
import { updatePutUserDto } from '../testing/update-put-user-dto.mock';
import { updatePatchUserDto } from '../testing/update-patch-user-dto.mock';

describe('UserController', () => {
  let userController: UserController;
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [userServiceMock],
    })
      .overrideGuard(AuthGuard)
      .useValue(guardMock)
      .overrideGuard(RoleGuard)
      .useValue(guardMock)
      .compile();

    userController = module.get<UserController>(UserController);
    userService = module.get<UserService>(UserService);
  });

  test('should be defined', () => {
    expect(userController).toBeDefined();
    expect(userService).toBeDefined();
  });

  test('Guards application', () => {
    const guards = Reflect.getMetadata('__guards__', UserController);
    expect(guards.length).toEqual(2);
    expect(guards).toEqual([AuthGuard, RoleGuard]);
  });

  describe('Create', () => {
    test('should create a user', async () => {
      const result = await userController.create(createUserDTO);
      expect(result).toEqual(userEntityList[0]);
    });
  });

  describe('Read', () => {
    test('should list users', async () => {
      const result = await userController.list();
      expect(result).toEqual(userEntityList);
    });

    test('should show a user', async () => {
      const result = await userController.show(1);
      expect(result).toEqual(userEntityList[0]);
    });
  });

  describe('Update', () => {
    test('should update a user', async () => {
      const result = await userController.update(1, updatePutUserDto);
      expect(result).toEqual(userEntityList[0]);
    });

    test('should update partial a user', async () => {
      const result = await userController.updatePartial(1, updatePatchUserDto);
      expect(result).toEqual(userEntityList[0]);
    });
  });

  describe('Delete', () => {
    test('should delete a user', async () => {
      const result = await userController.delete(1);
      expect(result).toEqual({ success: true });
    });
  });
});
