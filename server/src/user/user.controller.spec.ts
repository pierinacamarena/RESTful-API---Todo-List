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
    });

    it('should be defined', () => {
        expect(userController).toBeDefined();
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

        await expect(userController.deleteUser(userId)).resolves.toBeUndefined();
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


// import { Test, TestingModule } from '@nestjs/testing';
// import { UserController } from './user.controller';
// import { UserService } from './user.service';
// import { CreateUserDto } from './dto/create-user.dto';
// import { UpdateUserDto } from './dto/update-user.dto';

// describe('UserController', () => {
//     let userController: UserController;
//     let userService: UserService;

//     beforeEach(async () => {
//         const module: TestingModule = await Test.createTestingModule({
//             controllers: [UserController],
//             providers: [UserService],
//         })
//         .overrideProvider(UserService)
//         .useValue({
//             createUser: jest.fn().mockResolvedValue({id: 'testId', name: 'Test User'}),
//             getUserbyId: jest.fn().mockResolvedValue({id: 'testId', name: 'Test User'}),
//             modifyUser: jest.fn().mockResolvedValue({id: 'testId', name: 'Updated User'}),
//             deleteUser: jest.fn().mockResolvedValue({message: "User has been deleted"}),
//             getUsers: jest.fn().mockResolvedValue([{id: 'testId', name: 'Test User'}]),
//         })
//         .compile();

//         userController = module.get<UserController>(UserController);
//         userService = module.get<UserService>(UserService);
//     });

//     it('should be defined', () => {
//         expect(userController).toBeDefined();
//     });

//     it('should create user', async () => {
//         expect(await userController.createUser(new CreateUserDto())).toEqual({id: 'testId', name: 'Test User'});
//         expect(userService.createUser).toBeCalledTimes(1);
//     });

//     it('should get user by id', async () => {
//         expect(await userController.getUserbyId('testId')).toEqual({id: 'testId', name: 'Test User'});
//         expect(userService.getUserbyId).toBeCalledWith('testId');
//     });

//     it('should modify user', async () => {
//         expect(await userController.modifyUser('testId', new UpdateUserDto())).toEqual({id: 'testId', name: 'Updated User'});
//         expect(userService.modifyUser).toBeCalledWith('testId', expect.any(UpdateUserDto));
//     });

//     it('should delete user', async () => {
//         expect(await userController.deleteUser('testId')).toEqual({message: "User has been deleted"});
//         expect(userService.deleteUser).toBeCalledWith('testId');
//     });

//     it('should get all users', async () => {
//         expect(await userController.getUsers()).toEqual([{id: 'testId', name: 'Test User'}]);
//         expect(userService.getUsers).toBeCalledTimes(1);
//     });
// });
