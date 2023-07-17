import { Test, TestingModule } from '@nestjs/testing';
import { getPhoto } from '../testing/get-photo.mock';
import { FileService } from './file.service';

describe('FileService', () => {
  let fileService: FileService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FileService],
    }).compile();

    fileService = module.get<FileService>(FileService);
  });

  test('should be defined', () => {
    expect(fileService).toBeDefined();
  });

  describe('File Service Test', () => {
    test('should return a file', async () => {
      const photo = await getPhoto();
      const filename = 'photo-test.png';
      fileService.upload(photo, filename);
    });
  });
});
