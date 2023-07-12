import { Test, TestingModule } from '@nestjs/testing';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TaskDto } from './dto/task.dto';
import { v4 as uuidv4 } from 'uuid';

jest.mock('./tasks.service');

describe('TasksController', () => {
  let controller: TasksController;
  let service: jest.Mocked<TasksService>;

beforeEach(async () => {
  const module: TestingModule = await Test.createTestingModule({
    controllers: [TasksController],
    providers: [
      {
        provide: TasksService,
        useValue: {
          createTask: jest.fn(),
        },
      },
    ],
  }).compile();

  controller = module.get<TasksController>(TasksController);
  service = module.get(TasksService);
});

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
  describe('createTask', () => {
    it('should create a task', async () => {
      const dto: CreateTaskDto = {
        id: uuidv4(),
        userId: 'testUserId',
        title: 'TestTask',
        description: 'TestTask description',
        completed: false,
        inProgress: true,
        pk: 'user#:testUserId',
        sk: `task#:id`
      };

      const result: TaskDto = {
        id: dto.id,
        userId: dto.userId,
        title: dto.title,
        description: dto.description,
        completed: dto.completed,
        inProgress: dto.inProgress,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      jest.spyOn(service, 'createTask').mockResolvedValue(result);

      expect(await controller.createTask(dto)).toEqual(result);
      expect(service.createTask).toHaveBeenCalledWith(dto);
    });
});

  describe('getTasksByUser', () => {
    it('should get tasks by user', async () => {
      const userId = 'testUserId';
      const result = [{
        id: uuidv4(),
        title: 'TestTask',
        description: 'TestTask description',
        completed: false,
        inProgress: true,
        userId: userId,
        createdAt: new Date(),
        updatedAt: new Date()
      }];

      jest.spyOn(service, 'getTasksbyUser').mockResolvedValue(result);

      expect(await controller.getTasksByUser(userId)).toEqual(result);
      expect(service.getTasksbyUser).toHaveBeenCalledWith(userId);
    });
  });

  describe('getTask', () => {
    it('should get a task', async () => {
      const userId = 'testUserId';
      const taskId = uuidv4();
      const result = {
        id: taskId,
        title: 'TestTask',
        description: 'TestTask description',
        completed: false,
        inProgress: true,
        userId: userId,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      jest.spyOn(service, 'getTaskbyId').mockResolvedValue(result);

      expect(await controller.getTask(taskId, userId)).toEqual(result);
      expect(service.getTaskbyId).toHaveBeenCalledWith(taskId, userId);
    });
  });

  describe('modifyTask', () => {
    it('should modify a task', async () => {
      const userId = 'testUserId';
      const taskId = uuidv4();
      const dto: UpdateTaskDto = {
        title: 'ModifiedTask',
        description: 'ModifiedTask description',
        completed: true,
        inProgress: false
      };
      const result: TaskDto = {
        id: taskId,
        userId: userId,
        title: dto.title,
        description: dto.description,
        completed: dto.completed,
        inProgress: dto.inProgress,
        createdAt: new Date(),
        updatedAt: new Date()
      };
  
      jest.spyOn(service, 'modifyTask').mockResolvedValue(result);
  
      expect(await controller.modifyTask(taskId, userId, dto)).toEqual(result);
      expect(service.modifyTask).toHaveBeenCalledWith(taskId, dto, userId);
    });
  });
  
  

  describe('deleteTask', () => {
    it('should delete a task', async () => {
      const userId = 'testUserId';
      const taskId = uuidv4();

      jest.spyOn(service, 'deleteTask').mockResolvedValue();

      expect(await controller.deleteTask(taskId, userId)).toEqual({message: "Task has been deleted"});
      expect(service.deleteTask).toHaveBeenCalledWith(taskId, userId);
    });
  });

  describe('getAllTasks', () => {
    it('should get all tasks', async () => {
      const result = [{
        id: uuidv4(),
        title: 'TestTask',
        description: 'TestTask description',
        completed: false,
        inProgress: true,
        userId: 'testUserId',
        createdAt: new Date(),
        updatedAt: new Date()
      }];

      jest.spyOn(service, 'getAllTasks').mockResolvedValue(result);

      expect(await controller.getAllTasks()).toEqual(result);
      expect(service.getAllTasks).toHaveBeenCalled();
    });
  });
});
