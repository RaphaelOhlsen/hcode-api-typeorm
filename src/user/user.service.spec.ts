import { Test, TestingModule } from '@nestjs/testing';

import { userRepositoryMock } from '../testing/user-repository.mock';
import { UserService } from './user.service';
import { userEntityList } from '../testing/user-entity-list.mock';
import { createUserDTO } from '../testing/create-user-dto.mock';
import { Repository } from 'typeorm';
import { UserEntity } from './entity/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { updatePutUserDto } from '../testing/update-put-user-dto.mock';
import { updatePatchUserDto } from '../testing/update-patch-user-dto.mock';

describe('UserService', () => {
  let userService: UserService;
  let userRepository: Repository<UserEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserService, userRepositoryMock],
    }).compile();

    userService = module.get<UserService>(UserService);
    userRepository = module.get(getRepositoryToken(UserEntity));
  });

  test('should be defined', () => {
    expect(userService).toBeDefined();
    expect(userRepository).toBeDefined();
  });

  describe('Create', () => {
    test('should create a user', async () => {
      jest.spyOn(userRepository, 'exist').mockResolvedValueOnce(false);
      const result = await userService.create(createUserDTO);
      expect(result).toEqual(userEntityList[0]);
    });
  });

  describe('Read', () => {
    test('should return a users list', async () => {
      const result = await userService.list();
      expect(result).toEqual(userEntityList);
    });
    test('should return a user', async () => {
      const result = await userService.show(1);
      expect(result).toEqual(userEntityList[0]);
    });
  });
  describe('Update', () => {
    test('should update a user', async () => {
      const result = await userService.update(1, updatePutUserDto);
      expect(result).toEqual(userEntityList[0]);
    });
    test('shoul partial update a user', async () => {
      const result = await userService.updatePartial(1, updatePatchUserDto);
      expect(result).toEqual(userEntityList[0]);
    });
  });
  describe('Delete', () => {
    test('should delete a user', async () => {
      const result = await userService.delete(100);
      expect(result).toEqual(true);
    });
  });
});
