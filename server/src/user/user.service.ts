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
            throw new BadRequestException(error.message);
        }
    }

    //getter
    async getUserbyId(id: string) : Promise<UserDto> {
        const user = await this.User.get({id});
        if (!user || !user.Item) {
            throw new NotFoundException('User not found');
        }
        return user.Item;
    }

    //update function
    async modifyUser(id: string, updateUserDto: UpdateUserDto): Promise<UserDto> {
        const user = this.User.get({id});
        if (!user) {
            throw new NotFoundException('User not found');
        }
        try {
            const updatedUser = this.User.update({ id, ...updateUserDto});
            return updatedUser.Item;
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }

    //delete function
    async deleteUser(id:string) : Promise<void> {
        const user = await this.User.get({id});
        if (!user) {
            throw new NotFoundException(`User with ID ${id} not found`);
        }
        try {
            await this.User.remove({id});
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }


}
