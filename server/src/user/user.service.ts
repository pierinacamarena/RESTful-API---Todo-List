import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { DynamodbService } from 'src/dynamodb/dynamodb.service';
import { UserDto } from './dto/user.dto';

@Injectable()
export class UserService {
    private readonly User: any;

    constructor (private readonly dynamoService: DynamodbService) {
        this.User = this.dynamoService.table.getModel('User');
    }

    //create function
    async createUser(createUserDto: CreateUserDto) : Promise<void>{
        try {
            const user = await this.User.create(createUserDto);
            return user;
        } catch (error) {
            console.log('error.code: ', error.code);
            if (error.code === 'ConditionalCheckFailedException') {
                throw new ConflictException('User already exists');
            }
            console.log("ERROR IN USER CREATION");
            throw new BadRequestException(error.message);
        }
    }

    //getter
    async getUserbyId(id: string) : Promise<UserDto> {
        const user = await this.User.get({
            pk: `user#:${id}`,
            sk: `user#:${id}`
        }, {index: "primary"});
        if (!user) {
            throw new NotFoundException('User not found');
        }
        return user;
    }

    //update function
    async modifyUser(id: string, updateUserDto: UpdateUserDto): Promise<UserDto> {
        const user = this.User.get({
            pk: `user#:${id}`,
            sk: `user#:${id}`
        }, {index: "primary"});
        if (!user) {
            throw new NotFoundException('User not found');
        }
        try {
            const updatedUser = this.User.update({ pk: `user#:${id}`, sk: `user#:${id}`, ...updateUserDto });
            return updatedUser;
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }

    //delete function
    async deleteUser(id:string) : Promise<void> {
        const user = this.User.get({
            pk: `user#:${id}`,
            sk: `user#:${id}`
        }, {index: "primary"});
        if (!user) {
            throw new NotFoundException(`User with ID ${id} not found`);
        }
        try {
            await this.User.remove({ pk: `user#:${id}`, sk: `user#:${id}` });
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }

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
