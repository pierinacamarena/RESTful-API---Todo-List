import { ConflictException, NotFoundException, BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { TasksService } from './tasks.service';
import { DynamodbService } from 'src/dynamodb/dynamodb.service';

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

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TasksService, {
        provide: DynamodbService,
        useValue: {
          table: {
            getModel: jest.fn().mockReturnValue(baseMockModel),
          }
        }
      }],
    }).compile();

    service = module.get<TasksService>(TasksService);
    dynamoService = module.get<DynamodbService>(DynamodbService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('TasksService', () => {

    describe('createTask', () => {
      it('should throw a bad request exception if the task creation fails', async () => {
        jest.spyOn(service, 'createTask').mockImplementation(() => Promise.reject(new Error('Test error')));
    
        await expect(
          service.createTask({ id: '1', pk: 'task#1', sk: 'user#1', userId: '1', title: 'Test Task', completed: false }),
        ).rejects.toThrow(BadRequestException);
      });
    
      // More tests for createTask...
    });
  
    describe('modifyTask', () => {
      it('should successfully modify a task', async () => {
        jest.spyOn(dynamoService.table, 'getModel').mockImplementation(() => ({
          ...baseMockModel,
          get: () => Promise.resolve({ id: '1', title: 'TestTask', completed: false }),
          update: () => Promise.resolve({ id: '1', title: 'ModifiedTask', completed: true }),
        }));
  
        await expect(
          service.modifyTask('1', { title: 'ModifiedTask', completed: true }, '1'),
        ).resolves.toBeDefined();
      });
    });
  
    describe('getTaskbyId', () => {
      it('should successfully return a task by ID', async () => {
        jest.spyOn(dynamoService.table, 'getModel').mockImplementation(() => ({
          ...baseMockModel,
          get: () => Promise.resolve({ id: '1', title: 'TestTask', completed: false }),
        }));
  
        await expect(
          service.getTaskbyId('1', '1'),
        ).resolves.toBeDefined();
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
        jest.spyOn(service, 'deleteTask').mockImplementation(() => Promise.reject(new Error('Test error')));
    
        await expect(
          service.deleteTask('1', '1'),
        ).rejects.toThrow(BadRequestException);
      });
    
      // More tests for deleteTask...
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

});
