import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { DynamodbService } from 'src/dynamodb/dynamodb.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TaskDto } from './dto/task.dto';
import { Logger } from '@nestjs/common';


@Injectable()
export class TasksService {
    private readonly Task: any;

    constructor ( private readonly dynamoservice: DynamodbService) {
        this.Task = this.dynamoservice.table.getModel('Task');
    }

    async createTask(createTaskDto: CreateTaskDto) : Promise<void> {
        const logger = new Logger('TasksService'); // Create a logger instance
        try {
            logger.log(`Creating task with dto: ${JSON.stringify(createTaskDto)}`); // Log the DTO
        
            const task = await this.Task.create(createTaskDto);
        
            logger.log(`Created task: ${JSON.stringify(task)}`); // Log the created task
    
            return task;
        } catch (error) {
            logger.error(`Error creating task: ${error.message}`); // Log any error message
            throw new BadRequestException(error.message);
        }
    }
    
    // async createTask(createTaskDto: CreateTaskDto) : Promise<void> {
    //     const logger = new Logger('TasksService'); // Create a logger instance
    //     try {
    //         logger.log(`Creating task with dto: ${JSON.stringify(createTaskDto)}`); // Log the DTO
        
    //         // const { params, info } = this.Task.Table.prepare('create', createTaskDto);
    //         // console.log(params, info); // <-- Updated logging line 
    
    //         const task = await this.Task.create(createTaskDto);
        
    //         logger.log(`Created task: ${JSON.stringify(task)}`); // Log the created task
    
    //         return task;
    //     } catch (error) {
    //         logger.error(`Error creating task: ${error.message}`); // Log any error message
    //         throw new BadRequestException(error.message);
    //     }
    // }
    
    // async createTask(createTaskDto: CreateTaskDto) : Promise<void> {
    //     const logger = new Logger('TasksService'); // Create a logger instance
    //     try {
    //         logger.log(`Creating task with dto: ${JSON.stringify(createTaskDto)}`); // Log the DTO
       
    //         console.log(this.Task.toParams('create', createTaskDto)); // <-- Add this logging line
       
    //         const task = await this.Task.create(createTaskDto);
       
    //         logger.log(`Created task: ${JSON.stringify(task)}`); // Log the created task
       
    //         return task;
    //     } catch (error) {
    //         logger.error(`Error creating task: ${error.message}`); // Log any error message
    //         throw new BadRequestException(error.message);
    //     }
    //    }
       
    // async createTask(createTaskDto: CreateTaskDto) : Promise<void> {
    //     const logger = new Logger('TasksService'); // Create a logger instance
    //     try {
    //         logger.log(`Creating task with dto: ${JSON.stringify(createTaskDto)}`); // Log the DTO
    
    //         const task = await this.Task.create(createTaskDto);
    
    //         logger.log(`Created task: ${JSON.stringify(task)}`); // Log the created task
    
    //         return task;
    //     } catch (error) {
    //         logger.error(`Error creating task: ${error.message}`); // Log any error message
    //         throw new BadRequestException(error.message);
    //     }
    // }

    async modifyTask(id: string, updateTaskDto: UpdateTaskDto, userId: string) : Promise<TaskDto> {
        const task = await this.Task.get({
            pk: `user#${userId}`,
            sk: `task#${id}`
        }, {index: "primary"});
        if (!task) {
            throw new NotFoundException('Task not found');
        }
        try {
            const updateTask = await this.Task.update({ pk: `task#:${id}`, sk: `task#:${id}`, ...updateTaskDto });
            return updateTask;
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }

    async getTaskbyId(id: string, userId: string) : Promise<TaskDto> {
        try {
            console.log("id: ", id);
            const task = await this.Task.get({
                pk: `user#${userId}`,
                sk: `task#${id}`
            }, {index: "primary"});
    
            console.log("task:", task);
    
            if (!task || !task.Item) {
                throw new NotFoundException('Task not found');
            }
            
            return task.Item;
        } catch (error) {
            console.error("Error getting task by id:", error);
            throw new NotFoundException('Task not found');
        }
    }


    async getTasksbyUser(userId: string) : Promise<TaskDto[]> {
        try {
            const tasks = await this.Task.query({
                pk: `user#${userId}`,
            }, {index: "primary"});
            return tasks;
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }

    async deleteTask(id: string, userId:string) : Promise<void> {
        const task = await this.Task.get({
            pk: `user#${userId}`,
            sk: `task#${id}`
        }, {index: "primary"});
        if (!task) {
            throw new NotFoundException('Task with id ${id} not found');
        }
        try {
            this.Task.remove({ pk: `task#:${id}`, sk: `task#:${id}` });
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }

    async getAllTasks() : Promise<TaskDto[]> {
        const tasks = await this.Task.scan({});
        console.log(tasks);
        if (!tasks) {
            throw new NotFoundException('tasks not found');
        }
        return tasks;
    }
}
