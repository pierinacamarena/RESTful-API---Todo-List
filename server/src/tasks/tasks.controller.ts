import { Body, Controller, Param, Post, Get, Patch, Delete } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TaskDto } from './dto/task.dto';
import { v4 as uuidv4 } from 'uuid';


@Controller('tasks')
export class TasksController {
    constructor (private readonly tasksService: TasksService) {}

    /**
     * @route POST /tasks
     * 
     * Creates a new task with the data provided in createTaskDto
     * 
     * @param {CreateTaskDto} createTaskDto - Data Transfer Object for creating task
     * @returns Newly created task
     */
    @Post()
    async createTask(@Body() createTaskDto: CreateTaskDto) {
        if (!createTaskDto.id) {
            createTaskDto.id = uuidv4();
        }
        const pk = 'user#:' + createTaskDto.userId;
        const sk = 'task#:' + createTaskDto.id;
        createTaskDto.pk = pk;
        createTaskDto.sk = sk;
        const task = await this.tasksService.createTask(createTaskDto);
        return task;
    }

    /**
     * @route GET /tasks/user/:userId
     * 
     * Retrieves tasks of a specific user
     * 
     * @param {string} userId - The ID of the user
     * @returns List of tasks for the user with the provided userId
     */
    @Get('user/:userId')
    async getTasksByUser(@Param('userId') userId: string) {
        console.log("nani");
        const tasks = await this.tasksService.getTasksbyUser(userId);
        console.log("tasksperUser: [", tasks, "]");
        return tasks;
    }

    /**
     * @route GET /tasks/:userId/:id
     * 
     * Retrieves a task of a specific user by taskId
     * 
     * @param {string} id - The ID of the task
     * @param {string} userId - The ID of the user
     * @returns Task with the provided id for the specified user
     */
    @Get(':userId/:id')
    async getTask(@Param('id') id: string, @Param('userId') userId: string) {
        console.log("id: ", id);
        console.log("userid: ", userId);
        const task = await this.tasksService.getTaskbyId(id, userId);
        return task;
    }

    /**
     * @route PATCH /tasks/:userId/:id
     * 
     * Updates a task's details with the data provided in updateTaskDto
     * 
     * @param {string} id - The ID of the task
     * @param {string} userId - The ID of the user
     * @param {UpdateTaskDto} updateTaskDto - Data Transfer Object for updating task
     * @returns Updated task with the provided id
     */
    @Patch(':userId/:id')
    async modifyTask(@Param('id') id: string , @Param('userId') userId: string, @Body() updateTaskDto: UpdateTaskDto) {
        const task = await this.tasksService.modifyTask(id, updateTaskDto, userId);
        return task;
    }

    /**
     * @route DELETE /tasks/:userId/:id
     * 
     * Deletes a task by their id
     * 
     * @param {string} id - The ID of the task
     * @param {string} userId - The ID of the user
     * @returns Message indicating successful deletion
     */
    @Delete(':userId/:id')
    async deleteTask(@Param('id') id: string, @Param('userId') userId: string) {
        await this.tasksService.deleteTask(id, userId);
        return {message: "Task has been deleted"};
    }

    /**
     * @route GET /tasks
     * 
     * Retrieves all tasks
     * 
     * @returns List of all tasks
     */
    @Get()
    async getAllTasks() {
        const tasks = await this.tasksService.getAllTasks();
        return tasks;
    }
}
