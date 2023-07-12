import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserDto } from './dto/user.dto';
import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';

class MockUserService {
    createUser(createUserDto: CreateUserDto): Promise<UserDto> {
        const user: UserDto = {
            id: 'testId',
            name: createUserDto.name,
            email: createUserDto.email,
            password: createUserDto.password,
        };
        return Promise.resolve(user);
    }

    getUserbyId(id: string): Promise<UserDto> {
        const user: UserDto = {
            id,
            name: 'Test User',
            email: 'test@example.com',
            password: 'password',
        };
        return Promise.resolve(user);
    }

    modifyUser(id: string, updateUserDto: UpdateUserDto): Promise<UserDto> {
        const user: UserDto = {
            id,
            name: updateUserDto.name || 'Updated User',
            email: updateUserDto.email || 'updated@example.com',
            password: updateUserDto.password || 'updatedPassword',
        };
        return Promise.resolve(user);
    }

    deleteUser(id: string): Promise<void> {
        return Promise.resolve();
    }

    getUsers(): Promise<UserDto[]> {
        const users: UserDto[] = [
            {
                id: 'testId',
                name: 'Test User',
                email: 'test@example.com',
                password: 'password',
            },
        ];
        return Promise.resolve(users);
    }
}

describe('UserController', () => {
    let userController: UserController;
    let userService: UserService;

    let spy;
    let spyCreateUser;
    let spyGetUserbyId;
    let spyModifyUser;
    let spyDeleteUser;
    let spyGetUsers;

beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
        controllers: [UserController],
        providers: [
            {
                provide: UserService,
                useClass: MockUserService,
            },
        ],
    }).compile();

    userController = module.get<UserController>(UserController);
    userService = module.get<UserService>(UserService);

    spy = jest.spyOn(userService, 'createUser');
    spyCreateUser = jest.spyOn(userService, 'createUser');
    spyGetUserbyId = jest.spyOn(userService, 'getUserbyId');
    spyModifyUser = jest.spyOn(userService, 'modifyUser');
    spyDeleteUser = jest.spyOn(userService, 'deleteUser');
    spyGetUsers = jest.spyOn(userService, 'getUsers');
    });

afterEach(() => {
    spy.mockClear();
});
    it('should be defined', () => {
        expect(userController).toBeDefined();
        spyCreateUser.mockClear();
        spyGetUserbyId.mockClear();
        spyModifyUser.mockClear();
        spyDeleteUser.mockClear();
        spyGetUsers.mockClear();
    });

    it('should create user', async () => {
        const createUserDto: CreateUserDto = {
            name: 'John Doe',
            email: 'john@example.com',
            password: 'password123',
        };

        const expectedResult: UserDto = {
            id: 'testId',
            name: 'John Doe',
            email: 'john@example.com',
            password: 'password123',
        };

        const createdUser = await userController.createUser(createUserDto);

        expect(createdUser).toEqual(expectedResult);
        expect(userService.createUser).toHaveBeenCalledWith(createUserDto);
        expect(userService.createUser).toHaveBeenCalledTimes(1);
    });

    it('should get user by id', async () => {
        const userId = 'testId';

        const expectedResult: UserDto = {
            id: 'testId',
            name: 'Test User',
            email: 'test@example.com',
            password: 'password',
        };

        const user = await userController.getUserbyId(userId);

        expect(user).toEqual(expectedResult);
        expect(userService.getUserbyId).toHaveBeenCalledWith(userId);
        expect(userService.getUserbyId).toHaveBeenCalledTimes(1);
    });

    it('should modify user', async () => {
        const userId = 'testId';
        const updateUserDto: UpdateUserDto = {
            name: 'Updated User',
            email: 'updated@example.com',
            password: 'updatedPassword',
        };

        const expectedResult: UserDto = {
            id: 'testId',
            name: 'Updated User',
            email: 'updated@example.com',
            password: 'updatedPassword',
        };

        const modifiedUser = await userController.modifyUser(userId, updateUserDto);

        expect(modifiedUser).toEqual(expectedResult);
        expect(userService.modifyUser).toHaveBeenCalledWith(userId, updateUserDto);
        expect(userService.modifyUser).toHaveBeenCalledTimes(1);
    });

    it('should delete user', async () => {
        const userId = 'testId';
        const expectedMessage = {"message": "User has been deleted"};
    
        await expect(userController.deleteUser(userId)).resolves.toEqual(expectedMessage);
        expect(userService.deleteUser).toHaveBeenCalledWith(userId);
        expect(userService.deleteUser).toHaveBeenCalledTimes(1);
    });

    it('should get all users', async () => {
        const expectedResult: UserDto[] = [
            {
                id: 'testId',
                name: 'Test User',
                email: 'test@example.com',
                password: 'password',
            },
        ];

        const users = await userController.getUsers();

        expect(users).toEqual(expectedResult);
        expect(userService.getUsers).toHaveBeenCalledTimes(1);
    });
});
