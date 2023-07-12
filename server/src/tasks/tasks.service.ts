import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { DynamodbService } from '../dynamodb/dynamodb.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TaskDto } from './dto/task.dto';
import { Logger } from '@nestjs/common';
import { UserService } from '../user/user.service';


@Injectable()
export class TasksService {
    private readonly Task: any;

    /**
     * 
     * @param {DynamodbService} dynamoservice 
     * @param {UserService} userService 
     * 
     * The constructor initializes the TasksService and gets the Task model from the DynamodbService.
     */
    constructor (
        private readonly dynamoservice: DynamodbService,
        private readonly userService: UserService
        ) 
        {this.Task = this.dynamoservice.table.getModel('Task');}

    /**
     * 
     * @param {CreateUserDto} createUserDto - Data Transfer Object for creating user
     * @returns {Promise<void>} - Promise of type void
     * 
     * This method handles the creation of a new user.
     * It first checks if a user with the provided email already exists to avoid duplicates,
     * then hashes the password, merges it back to the DTO, and creates a user.
     */
    async createTask(createTaskDto: CreateTaskDto) : Promise<TaskDto> {
        const logger = new Logger('TasksService');
        try {
            await this.userService.getUserbyId(createTaskDto.userId);
            const task = await this.Task.create(createTaskDto);    
            return task;
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }

    /**
     * 
     * @param {string} id - The ID of the user
     * @returns {Promise<UserDto>} - Promise of type UserDto
     * 
     * This method retrieves a user by their id from DynamoDB. 
     * It throws a NotFoundException if no user is found.
     */
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

    /**
     * 
     * @param {string} id - The ID of the user
     * @param {UpdateUserDto} updateUserDto - Data Transfer Object for updating user
     * @returns {Promise<UserDto>} - Promise of type UserDto
     * 
     * This method updates a user's details by their id.
     * It checks if a user with the provided email (from the update DTO) already exists to avoid duplicates,
     * then updates the user details and returns the updated user.
     */
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

     /**
     * 
     * @param {string} id - The ID of the user
     * @returns {Promise<void>} - Promise of type void
     * 
     * This method deletes a user by their id.
     * It first checks if the user exists, if not, it throws a NotFoundException.
     * If the user exists, it removes the user.
     */
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

    /**
     * 
     * @returns {Promise<UserDto[]>} - Promise of type array of UserDto
     * 
     * This debug method retrieves all users from DynamoDB.
     * This may not be necessary for the final application and could be removed or secured.
     */
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
