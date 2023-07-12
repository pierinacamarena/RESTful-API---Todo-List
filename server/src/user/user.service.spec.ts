import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { DynamodbService } from '../dynamodb/dynamodb.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserDto } from './dto/user.dto';
import { CreateUserDto } from './dto/create-user.dto';
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

const mockUsers: UserDto[] = [
  { id: '1', name: 'John Doe', email: 'john@example.com', password: 'password' },
  { id: '2', name: 'Jane Smith', email: 'jane@example.com', password: 'password123' },
];

describe('UserService', () => {
  let service: UserService;
  let User: any;
  let dynamoService: DynamodbService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: DynamodbService,
          useValue: {
            table: {
              getModel: jest.fn().mockReturnValue(baseMockModel),
            },
            
          },
        },
        {
          provide: 'User',
          useValue: {
            scan: jest.fn().mockResolvedValue(mockUsers),
          },
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    dynamoService = module.get<DynamodbService>(DynamodbService);
    User = module.get('User')
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

    const mockUser: UserDto = { id: '1', name: 'John Doe', email: 'john@example.com', password: 'password' };
    it('should create a user if it doesn\'t exist', async () => {
      jest.spyOn(dynamoService.table, 'getModel').mockImplementation(() => ({
        ...baseMockModel,
        find: () => Promise.resolve([mockUser]),
      }));
      const createUserDto: CreateUserDto = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password',
      };

      const createdUser = await service.createUser(createUserDto);

      expect(createdUser).toEqual({ id: '2', name: 'John Doe', email: 'john@example.com', password: 'password' });
      expect(dynamoService.table.create).toHaveBeenCalledWith(createUserDto);
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

    it('should get a user if it exists', async () => {
      const mockUser: UserDto = { id: '1', name: 'John Doe', email: 'john@example.com', password: 'password' };

      jest.spyOn(dynamoService.table, 'getModel').mockImplementation(() => ({
        ...baseMockModel,
        find: jest.fn().mockReturnValue(Promise.resolve([mockUser])),
      }));

      const user = await service.getUserbyId('1');

      expect(user).toEqual(mockUser);
      expect(dynamoService.table.find).toHaveBeenCalledWith({ id: '1' });
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

    it('should modify a user if it exists', async () => {
      const userId = '1';
      const updateUserDto: UpdateUserDto = {
        name: 'Updated User',
        email: 'updated@example.com',
        password: 'updatedPassword',
      };

      const mockUser: UserDto = {
        id: userId,
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password',
      };

      jest.spyOn(dynamoService.table, 'getModel').mockImplementation(() => ({
        ...baseMockModel,
        get: jest.fn().mockReturnValue(Promise.resolve(mockUser)),
        update: jest.fn().mockReturnValue({ ...mockUser, ...updateUserDto }),
      }));

      const modifiedUser = await service.modifyUser(userId, updateUserDto);

      expect(modifiedUser).toEqual({ ...mockUser, ...updateUserDto });
      expect(dynamoService.table.update).toHaveBeenCalledWith({ id: userId }, updateUserDto);
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

    // Additional test: should delete a user if it exists
    it('should delete a user if it exists', async () => {
      const userId = '1';

      const mockUser: UserDto = {
        id: userId,
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password',
      };

      jest.spyOn(dynamoService.table, 'getModel').mockImplementation(() => ({
        ...baseMockModel,
        get: jest.fn().mockReturnValue(Promise.resolve(mockUser)),
        remove: jest.fn(),
      }));

      await expect(service.deleteUser(userId)).resolves.toBeUndefined();
      expect(dynamoService.table.remove).toHaveBeenCalledWith({ id: userId });
    });
  });

  describe('getUsers', () => {
    it('should get all users if they exist', async () => {
      const users = await service.getUsers();

      expect(users).toEqual(mockUsers);
      expect(User.scan).toHaveBeenCalled();
    });

    it('should throw a NotFoundException if no users are found', async () => {
      User.scan.mockResolvedValue([]);

      await expect(service.getUsers()).rejects.toThrow(NotFoundException);
    });
  });
});

