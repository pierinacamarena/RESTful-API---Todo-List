import { Controller, Post, Get, Patch, Put, Delete, Body, Res, Param, HttpException, HttpStatus } from '@nestjs/common';
import { UserService } from './user.service';
import { Request, Response } from 'express';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UserController {
    constructor( private readonly userService: UserService ){}

    @Post()
    async createUser(@Body() createUserDto: CreateUserDto) {
        const user = await this.userService.createUser(createUserDto);
        return user;
    }

    @Get(':id')
    async getUserbyId(@Param('id') id: string) {
        const user = await this.userService.getUserbyId(id);
        return user;
    }

    @Patch(':id')
    async modifyUser(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
        const user = await this.userService.modifyUser(id, updateUserDto);
        return user;
    }

    @Delete(':id')
    async deleteUser(@Param('id') id: string) {
        await this.userService.deleteUser(id);
        return {message: "User has been deleted"};
    }
    
    @Get()
    async getUsers() {
        const users = await this.userService.getUsers();
        return users;
    }
}
