import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

describe('UserController', () => {
    let userController: UserController;
    let userService: UserService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [UserController],
            providers: [UserService],
        })
        .overrideProvider(UserService)
        .useValue({
            createUser: jest.fn().mockResolvedValue({id: 'testId', name: 'Test User'}),
            getUserbyId: jest.fn().mockResolvedValue({id: 'testId', name: 'Test User'}),
            modifyUser: jest.fn().mockResolvedValue({id: 'testId', name: 'Updated User'}),
            deleteUser: jest.fn().mockResolvedValue({message: "User has been deleted"}),
            getUsers: jest.fn().mockResolvedValue([{id: 'testId', name: 'Test User'}]),
        })
        .compile();

        userController = module.get<UserController>(UserController);
        userService = module.get<UserService>(UserService);
    });

    it('should be defined', () => {
        expect(userController).toBeDefined();
    });

    it('should create user', async () => {
        expect(await userController.createUser(new CreateUserDto())).toEqual({id: 'testId', name: 'Test User'});
        expect(userService.createUser).toBeCalledTimes(1);
    });

    it('should get user by id', async () => {
        expect(await userController.getUserbyId('testId')).toEqual({id: 'testId', name: 'Test User'});
        expect(userService.getUserbyId).toBeCalledWith('testId');
    });

    it('should modify user', async () => {
        expect(await userController.modifyUser('testId', new UpdateUserDto())).toEqual({id: 'testId', name: 'Updated User'});
        expect(userService.modifyUser).toBeCalledWith('testId', expect.any(UpdateUserDto));
    });

    it('should delete user', async () => {
        expect(await userController.deleteUser('testId')).toEqual({message: "User has been deleted"});
        expect(userService.deleteUser).toBeCalledWith('testId');
    });

    it('should get all users', async () => {
        expect(await userController.getUsers()).toEqual([{id: 'testId', name: 'Test User'}]);
        expect(userService.getUsers).toBeCalledTimes(1);
    });
});
