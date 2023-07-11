import { Body, Controller, Param, Post, Get, Patch, Delete } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TaskDto } from './dto/task.dto';

@Controller('tasks')
export class TasksController {
    constructor (private readonly tasksService: TasksService) {}

    @Post()
    async createTask(@Body() createTaskDto: CreateTaskDto) {
        const task = await this.tasksService.createTask(createTaskDto);
        return task;
    }

    @Get(':id')
    async getTask(@Param('id') id: string) {
        const task = await this.tasksService.getTaskbyId(id);
        return task;
    }

    @Patch(':id')
    async modifyTask(@Param('id') id: string , @Body() updateTaskDto: UpdateTaskDto) {
        const task = await this.tasksService.modifyTask(id, updateTaskDto);
        return task;
    }

    @Delete(':id')
    async deleteTask(@Param('id') id: string) {
        await this.tasksService.deleteTask(id);
        return {message: "Task has been deleted"};
    }

    @Get('user/:userId')
    async getTasksByUser(@Param('userId') userId: string) {
        const tasks =  this.tasksService.getTasksbyUser(userId);
        return tasks;
    }
}


