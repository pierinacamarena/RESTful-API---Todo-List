import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { DynamodbService } from 'src/dynamodb/dynamodb.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TaskDto } from './dto/task.dto';


@Injectable()
export class TasksService {
    private readonly Task: any;

    constructor ( private readonly dynamoservice: DynamodbService) {
        this.Task = this.dynamoservice.table.getModel('Task');
    }

    async createTask(createTaskDto: CreateTaskDto) : Promise<void> {
        try {
            const task = await this.Task.create(createTaskDto);
            return task
        } catch (error) {
            console.log('error.code: ', error.code);
            if (error.code === 'ConditionalCheckFailedException') {
                throw new ConflictException('User already exists');
            }
            throw new BadRequestException(error.message);
        }
    }

    async modifyTask(id: string, updateTaskDto: UpdateTaskDto) : Promise<TaskDto> {
        const task = await this.Task.get({id});
        if (!task) {
            throw new NotFoundException('Task not found');
        }
        try {
            const updateTask = await this.Task.update({id, ...updateTaskDto});
            return updateTask.Item;
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }

    async getTaskbyId(id: string) : Promise<TaskDto> {
        const task = await this.Task.get({id});
        if (!task || !task.Item) {
            throw new NotFoundException('Task not found');
        }
        return task.Item;
    }

    async getTasksbyUser(userId: string) : Promise<TaskDto[]> {
        try {
            const tasks = await this.Task.find({userId});
            return tasks.Item;
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }

    async deleteTask(id: string) : Promise<void> {
        const task = await this.Task.get({id});
        if (!task) {
            throw new NotFoundException('Task with id ${id} not found');
        }
        try {
            this.Task.remove({id});
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }
}
