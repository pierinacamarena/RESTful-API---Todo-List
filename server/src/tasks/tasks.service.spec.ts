import { ConflictException, NotFoundException, BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { TasksService } from './tasks.service';
import { DynamodbService } from '../dynamodb/dynamodb.service';
import { UserService } from '../user/user.service';

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

describe('TasksService', () => {
  let service: TasksService;
  let dynamoService: DynamodbService;
  let userService: UserService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TasksService,
        DynamodbService,
      {
        provide: UserService,
        useValue: {
          getUserbyId: jest.fn()
        },
    }],
    }).compile();

    service = module.get<TasksService>(TasksService);
    dynamoService = module.get<DynamodbService>(DynamodbService);
    userService = module.get<UserService>(UserService); 
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createTask', () => {
    it('should create a task when user exists', async () => {
      jest.spyOn(userService, 'getUserbyId').mockImplementationOnce(() => Promise.resolve({ id: 'test-user-id', name: 'Test User', email: 'test@example.com', password: 'test-password' }));
    });

    it('should not create a task when user does not exist', async () => {
      jest.spyOn(userService, 'getUserbyId').mockImplementationOnce(() => Promise.reject(new NotFoundException('User not found')));
    });
  });
  
  describe('modifyTask', () => {
    it('should successfully modify a task', async () => {
      const mockTask = {
        get: jest.fn().mockResolvedValue({ id: '1', title: 'TestTask'}),
        update: jest.fn().mockResolvedValue({ id: '1', title: 'ModifiedTask'}),
      };
        
      Reflect.set(service, 'Task', mockTask);
      
      await expect(service.modifyTask('1', { title: 'ModifiedTask', completed: true }, '1')).resolves.toBeDefined();
      
      expect(mockTask.get).toHaveBeenCalledWith({
        pk: `user#:${'1'}`,
        sk: `task#:${'1'}`
      }, {index: "primary"});
  
      expect(mockTask.update).toHaveBeenCalledWith({
        pk: `user#:${'1'}`,
        sk: `task#:${'1'}`,
        ...{ title: 'ModifiedTask', completed: true }
      });
    });
  });

  describe('getTaskbyId', () => {
    it('should successfully return a task by ID', async () => {
      const mockTask = {
        get: jest.fn().mockResolvedValue({ id: '1', title: 'TestTask', completed: false }),
      };
        
      Reflect.set(service, 'Task', mockTask);
      
      await expect(service.getTaskbyId('1', '1')).resolves.toBeDefined();
      
      expect(mockTask.get).toHaveBeenCalledWith({
        pk: `user#:${'1'}`,
        sk: `task#:${'1'}`
      }, {index: "primary"});
    });
  });
  
  
    describe('getTasksbyUser', () => {
      it('should successfully return tasks by User ID', async () => {
        jest.spyOn(dynamoService.table, 'getModel').mockImplementation(() => ({
          ...baseMockModel,
          queryItems: () => Promise.resolve([{ id: '1', title: 'TestTask', completed: false }]),
        }));
  
        await expect(
          service.getTasksbyUser('1'),
        ).resolves.toBeDefined();
      });
    });

    describe('deleteTask', () => {
      it('should throw a bad request exception if the task deletion fails', async () => {
        const mockTask = {
          get: jest.fn().mockResolvedValue({ id: '1', title: 'TestTask', completed: false }),
          remove: jest.fn().mockRejectedValue(new Error('Test error')),
        };
          
        Reflect.set(service, 'Task', mockTask);
        
        await expect(service.deleteTask('1', '1')).rejects.toThrow(BadRequestException);
        
        expect(mockTask.get).toHaveBeenCalledWith({
          pk: `user#:${'1'}`,
          sk: `task#:${'1'}`
        }, {index: "primary"});
        
        expect(mockTask.remove).toHaveBeenCalledWith({
          pk: `user#:${'1'}`,
          sk: `task#:${'1'}`
        });
      });
    });
  
    describe('getAllTasks', () => {
      it('should successfully return all tasks', async () => {
        jest.spyOn(dynamoService.table, 'getModel').mockImplementation(() => ({
          ...baseMockModel,
          scan: () => Promise.resolve([{ id: '1', title: 'TestTask', completed: false }]),
        }));
  
        await expect(
          service.getAllTasks(),
        ).resolves.toBeDefined();
      });
    });
});
