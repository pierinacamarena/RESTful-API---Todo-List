import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { DynamodbService } from 'src/dynamodb/dynamodb.service';

@Injectable()
export class UserService {
    constructor (private readonly dynamoService: DynamodbService) {}

    //create function
    async createUser(createUserDto: CreateUserDto) {
        const User = this.dynamoService.table.getModel('User');
        const user = await User.create(createUserDto);
        return user;
    }
    //update function

    //delete function
}
