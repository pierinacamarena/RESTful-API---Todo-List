import { Controller, Post, Get, Body, Res } from '@nestjs/common';
import { UserService } from './user.service';
import { Request, Response } from 'express';

@Controller('user')
export class UserController {
    constructor(
        private userService: UserService
    ){}

    // @Post('new')
    // async createOneUser() {

    // }

}
