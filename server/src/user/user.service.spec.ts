import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { DynamodbService } from '../dynamodb/dynamodb.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserDto } from './dto/user.dto';
import { BadRequestException, ConflictException, NotFoundException } from '@nestjs/common';

const baseMockModel = {
  create: jest.fn(),
  find: jest.fn(),
  get: jest.fn(),
  load: jest.fn(),
  init: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
  scan: jest.fn(),
  upsert: jest.fn(),
  check: jest.fn(),
};

describe('UserService', () => {
  let service: UserService;
  let dynamoService: DynamodbService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserService,
        DynamodbService,
        {
        provide: DynamodbService,
        useValue: {
          table: {
            getModel: jest.fn().mockReturnValue(baseMockModel)
          }
        }
      },
    ],
    }).compile();

    service = module.get<UserService>(UserService);
    dynamoService = module.get<DynamodbService>(DynamodbService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createUser', () => {
    it('should throw a conflict exception if the user exists', async () => {
      jest.spyOn(dynamoService.table, 'getModel').mockImplementation(() => ({
        ...baseMockModel,
        find: () => Promise.resolve([{ id: '1', email: 'test@test.com' }]),
      }));

      await expect(
        service.createUser({ name: 'TestUser', email: 'test@test.com', password: 'testPassword' }),
      ).rejects.toThrow(BadRequestException);
    });

  });

  describe('getUserbyId', () => {
    it('should throw a NotFoundException if user is not found', async () => {
      jest.spyOn(dynamoService.table, 'getModel').mockImplementation(() => ({
        ...baseMockModel,
        find: jest.fn().mockReturnValue(Promise.resolve([])), 
      }));
  
      await expect(service.getUserbyId('1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('modifyUser', () => {
    it('should throw a NotFoundException if user is not found', async () => {
      jest.spyOn(dynamoService.table, 'getModel').mockImplementation(() => ({
        ...baseMockModel,
        get: jest.fn().mockReturnValue(Promise.resolve(null)), 
      }));

      const mockUpdateUserDto: UpdateUserDto = {
        name: 'Test',
        email: 'test@test.com',
        password: 'password123',
      };
  
      await expect(service.modifyUser('1', mockUpdateUserDto)).rejects.toThrow(NotFoundException);
    });
  });
  
  describe('deleteUser', () => {
    it('should throw a NotFoundException if user is not found', async () => {
      jest.spyOn(dynamoService.table, 'getModel').mockImplementation(() => ({
        ...baseMockModel,
        get: jest.fn().mockReturnValue(Promise.resolve(null)), 
      }));
  
      await expect(service.deleteUser('1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('getUsers', () => {
    it('should throw a NotFoundException if user is not found', async () => {
      const mockUsers: UserDto[] = [];

      jest.spyOn(dynamoService.table, 'getModel').mockImplementation(() => ({
        ...baseMockModel,
        scan: jest.fn().mockReturnValue(Promise.resolve(mockUsers)),  
      }));
  
      await expect(service.getUsers()).rejects.toThrow(NotFoundException);
    });
  });

});
