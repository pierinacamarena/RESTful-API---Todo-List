import { Body, Controller, Param, Post, Get, Patch, Delete } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TaskDto } from './dto/task.dto';
import { v4 as uuidv4 } from 'uuid';


@Controller('tasks')
export class TasksController {
    constructor (private readonly tasksService: TasksService) {}

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

    @Get('user/:userId')
    async getTasksByUser(@Param('userId') userId: string) {
        console.log("nani");
        const tasks = await this.tasksService.getTasksbyUser(userId);
        console.log("tasksperUser: [", tasks, "]");
        return tasks;
    }

    @Get(':userId/:id')
    async getTask(@Param('id') id: string, @Param('userId') userId: string) {
        console.log("id: ", id);
        console.log("userid: ", userId);
        const task = await this.tasksService.getTaskbyId(id, userId);
        return task;
    }

    @Patch(':userId/:id')
    async modifyTask(@Param('id') id: string , @Param('userId') userId: string, @Body() updateTaskDto: UpdateTaskDto) {
        const task = await this.tasksService.modifyTask(id, updateTaskDto, userId);
        return task;
    }

    @Delete(':userId/:id')
    async deleteTask(@Param('id') id: string, @Param('userId') userId: string) {
        await this.tasksService.deleteTask(id, userId);
        return {message: "Task has been deleted"};
    }

    //Debug
    @Get()
    async getAllTasks() {
        const tasks = await this.tasksService.getAllTasks();
        return tasks;
    }
}


