import { Test, TestingModule } from '@nestjs/testing';
import { TasksService } from './tasks.service';
import { DynamodbService } from 'src/dynamodb/dynamodb.service';


describe('TasksService', () => {
  let service: TasksService;
  let dynamoService: DynamodbService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TasksService, DynamodbService],
    }).compile();

    service = module.get<TasksService>(TasksService);
    dynamoService = module.get<DynamodbService>(DynamodbService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  
});
