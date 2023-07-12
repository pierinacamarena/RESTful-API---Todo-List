import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { DynamodbService } from '../dynamodb/dynamodb.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TaskDto } from './dto/task.dto';
import { Logger } from '@nestjs/common';
import { UserService } from 'src/user/user.service';


@Injectable()
export class TasksService {
    private readonly Task: any;

    constructor (
        private readonly dynamoservice: DynamodbService,
        private readonly userService: UserService
        ) 
        {this.Task = this.dynamoservice.table.getModel('Task');}

    async createTask(createTaskDto: CreateTaskDto) : Promise<void> {
        const logger = new Logger('TasksService'); // Create a logger instance
        try {
            await this.userService.getUserbyId(createTaskDto.userId);
            const task = await this.Task.create(createTaskDto);    
            return task;
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }

    async modifyTask(id: string, updateTaskDto: UpdateTaskDto, userId: string) : Promise<TaskDto> {
        const task = await this.Task.get({
            pk: `user#:${userId}`,
            sk: `task#:${id}`
        }, {index: "primary"});      
        if (!task) {
            throw new NotFoundException('Task not found');
        }
        try {
            const updateTask = await this.Task.update(
                { pk: `user#:${userId}`, sk: `task#:${id}`, ...updateTaskDto },
            );
            return updateTask;
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }

    async getTaskbyId(id: string, userId: string) : Promise<TaskDto> {
        try {
            const task = await this.Task.get({
                pk: `user#:${userId}`,
                sk: `task#:${id}`
            }, {index: "primary"});
            if (!task) {
                throw new NotFoundException('Task not found');
            }
            return task;
        } catch (error) {
            throw new NotFoundException('Task not found');
        }
    }

    async getTasksbyUser(userId: string) : Promise<TaskDto[]> {
        try {
            const tasks = await this.Task.queryItems({
                userId: userId,
            }, {index: "gsUserTasks"});
            return tasks;
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }

    async deleteTask(id: string, userId:string) : Promise<void> {
        const task = await this.Task.get({
            pk: `user#:${userId}`,
            sk: `task#:${id}`
        }, {index: "primary"});  
        if (!task) {
            throw new NotFoundException(`Task with id ${id} not found`);
        }
        try {
            await this.Task.remove({ pk: `user#:${userId}`, sk: `task#:${id}` });
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }

    async getAllTasks() : Promise<TaskDto[]> {
        const tasks = await this.Task.scan({});
        if (!tasks) {
            throw new NotFoundException('tasks not found');
        }
        return tasks;
    }
}
