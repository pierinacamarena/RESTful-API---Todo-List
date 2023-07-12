import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { DynamodbService } from '../dynamodb/dynamodb.service';
import { UserDto } from './dto/user.dto';
import { ConflictException, NotFoundException } from '@nestjs/common';

describe('UserService', () => {
  let service: UserService;
  let dynamoService: DynamodbService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserService, DynamodbService],
    }).compile();

    service = module.get<UserService>(UserService);
    dynamoService = module.get<DynamodbService>(DynamodbService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createUser', () => {
    it('should throw a conflict exception if the user exists', async () => {
      // jest.spyOn(dynamoService.table, 'getModel').mockImplementation(() => () => ({
      //   find: () => Promise.resolve([{ id: '1', email: 'test@test.com' }]),
      //   create: jest.fn().mockReturnValue(Promise.resolve(null)),
      // }));
      // jest.spyOn(dynamoService.table, 'getModel').mockImplementation(() => ({
      //   find: () => Promise.resolve([{ id: '1', email: 'test@test.com' }]),
      //   create: jest.fn().mockReturnValue(Promise.resolve(null)),
      //   get: jest.fn().mockReturnValue(Promise.resolve(null)),
      //   load: jest.fn().mockReturnValue(Promise.resolve([])),
      //   init: jest.fn().mockReturnValue(Promise.resolve()),
      //   update: jest.fn().mockReturnValue(Promise.resolve(null)),
      //   remove: jest.fn().mockReturnValue(Promise.resolve()),
      //   scan: jest.fn().mockReturnValue(Promise.resolve([])),
      //   upsert: jest.fn().mockReturnValue(Promise.resolve(null)),
      //   check: jest.fn().mockReturnValue(Promise.resolve(null)),
      //   // Add all other methods as needed...
      // }));

      await expect(
        service.createUser({ name: 'Test User', email: 'test@test.com', password: 'testPassword' }),
      ).rejects.toThrow(ConflictException);
    });

    // More tests for createUser...
  });

  describe('getUserbyId', () => {
    it('should throw a NotFoundException if user is not found', async () => {
      jest.spyOn(dynamoService.table, 'getModel').mockImplementation(() => ({
        find: jest.fn().mockReturnValue(Promise.resolve([])),
        create: jest.fn().mockReturnValue(Promise.resolve(null)),
        get: () => Promise.resolve(null),
        load: jest.fn().mockReturnValue(Promise.resolve([])),
        init: jest.fn().mockReturnValue(Promise.resolve()),
        update: jest.fn().mockReturnValue(Promise.resolve(null)),
        remove: jest.fn().mockReturnValue(Promise.resolve()),
        scan: jest.fn().mockReturnValue(Promise.resolve([])),
        upsert: jest.fn().mockReturnValue(Promise.resolve(null)),
        check: jest.fn().mockReturnValue(Promise.resolve(null)),
      }));

      await expect(service.getUserbyId('1')).rejects.toThrow(NotFoundException);
    });

    // More tests for getUserbyId...
    });
});
