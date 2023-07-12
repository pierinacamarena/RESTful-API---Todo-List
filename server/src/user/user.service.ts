import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { DynamodbService } from '../dynamodb/dynamodb.service';
import { UserDto } from './dto/user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
    private readonly User: any;

    constructor (private readonly dynamoService: DynamodbService) {
        this.User = this.dynamoService.table.getModel('User');
    }

    //create function
    async createUser(createUserDto: CreateUserDto) : Promise<void>{
        try {
            const existingUser = await this.User.find({email: createUserDto.email}, {index: 'gs2'});
            console.log(existingUser); 
            if (existingUser.length > 0) {
                console.log("there is a user with this email ");
                throw new ConflictException('User already exists');
            }
            const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
            const userDtoWithHashedPassword = { ...createUserDto, password: hashedPassword };
            const user = await this.User.create(userDtoWithHashedPassword);
            return user;
        } catch (error) {
            console.log("[", error, "]");
            if (error instanceof ConflictException) {
                console.log("here");
                throw new ConflictException('User already exists');
            }
            throw new BadRequestException(error.message);
        }
    }

    //getters
    async getUserbyId(id: string) : Promise<UserDto> {
        const user = await this.User.get({
            pk: `user:${id}`,
            sk: `user:`
        }, {index: "primary"});
        if (!user) {
            throw new NotFoundException('User not found');
        }
        return user;
    }

    //update function
    async modifyUser(id: string, updateUserDto: UpdateUserDto): Promise<UserDto> {
        const user = await this.User.get({
            pk: `user:${id}`,
            sk: `user:`
        }, {index: "primary"});
        if (!user) {
            throw new NotFoundException('User not found');
        }
        const existingUser = await this.User.find({email: updateUserDto.email}, {index: 'gs2'});
   
        if (existingUser && existingUser.length > 0) {
            throw new ConflictException('Email already in use');
        }
        try {
            const updatedUser = await this.User.update({ pk: `user:${id}`, sk: `user:`, ...updateUserDto });
            return updatedUser;
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }

    //delete function
    async deleteUser(id:string) : Promise<void> {
        const user = await this.User.get({
            pk: `user:${id}`,
            sk: `user:`
        }, {index: "primary"});
        if (!user) {
            throw new NotFoundException(`User with ID ${id} not found`);
        }
        try {
            await this.User.remove({ pk: `user:${id}`, sk: `user:` });
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }

    //Debug
    //getter for all users
    async getUsers() : Promise<UserDto[]> {
        const users = await this.User.scan({});
        console.log(users);
        if (!users) {
            throw new NotFoundException('Users not found');
        }
        return users;
    }

}
