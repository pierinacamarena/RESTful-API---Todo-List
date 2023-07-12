import { Controller, Post, Get, Patch, Put, Delete, Body, Res, Param, HttpException, HttpStatus } from '@nestjs/common';
import { UserService } from './user.service';
import { Request, Response } from 'express';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UserController {
    constructor( private readonly userService: UserService ){}

    /**
     * @route POST /users
     * 
     * Creates a new user with the data provided in createUserDto
     * 
     * @param {CreateUserDto} createUserDto - Data Transfer Object for creating user
     * @returns Newly created user
     */
    @Post()
    async createUser(@Body() createUserDto: CreateUserDto) {
        const user = await this.userService.createUser(createUserDto);
        return user;
    }

    /**
     * @route GET /users/:id
     * 
     * Retrieves a user by their id
     * 
     * @param {string} id - The ID of the user
     * @returns User with the provided id
     */
    @Get(':id')
    async getUserbyId(@Param('id') id: string) {
        const user = await this.userService.getUserbyId(id);
        return user;
    }

    /**
     * @route PATCH /users/:id
     * 
     * Updates a user's details with the data provided in updateUserDto
     * 
     * @param {string} id - The ID of the user
     * @param {UpdateUserDto} updateUserDto - Data Transfer Object for updating user
     * @returns Updated user with the provided id
     */
    @Patch(':id')
    async modifyUser(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
        const user = await this.userService.modifyUser(id, updateUserDto);
        return user;
    }
    
    /**
     * @route DELETE /users/:id
     * 
     * Deletes a user by their id
     * 
     * @param {string} id - The ID of the user
     * @returns Message indicating successful deletion
     */
    @Delete(':id')
    async deleteUser(@Param('id') id: string) {
        await this.userService.deleteUser(id);
        return {message: "User has been deleted"};
    }
    
    /**
     * @route GET /users
     * 
     * Retrieves all users
     * 
     * @returns List of all users
     */
    @Get()
    async getUsers() {
        const users = await this.userService.getUsers();
        return users;
    }
}
