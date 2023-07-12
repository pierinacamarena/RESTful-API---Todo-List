import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { DynamodbService } from '../dynamodb/dynamodb.service';
import { UserDto } from './dto/user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
    private readonly User: any;

    /**
     * 
     * @param {DynamodbService} dynamoService 
     * 
     * The constructor initializes the UserService and gets the User model from the DynamodbService.
     */
    constructor (private readonly dynamoService: DynamodbService) {
        this.User = this.dynamoService.table.getModel('User');
    }

    /**
     * 
     * @param {CreateUserDto} createUserDto - Data Transfer Object for creating user
     * @returns {Promise<void>} - Promise of type void
     * 
     * This method handles the creation of a new user.
     * It first checks if a user with the provided email already exists to avoid duplicates,
     * then hashes the password, merges it back to the DTO, and creates a user.
     */
    async createUser(createUserDto: CreateUserDto) : Promise<void>{
        try {
            const existingUser = await this.User.find({email: createUserDto.email}, {index: 'gs2'});
            console.log(existingUser); 
            if (existingUser.length > 0) {
                throw new ConflictException('User already exists');
            }
            const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
            const userDtoWithHashedPassword = { ...createUserDto, password: hashedPassword };
            const user = await this.User.create(userDtoWithHashedPassword);
            return user;
        } catch (error) {
            if (error instanceof ConflictException) {
                console.log("here");
                throw new ConflictException('User already exists');
            }
            throw new BadRequestException(error.message);
        }
    }
    /**
     * 
     * @param {string} id - The ID of the user
     * @returns {Promise<UserDto>} - Promise of type UserDto
     * 
     * This method retrieves a user by their id from DynamoDB. 
     * It throws a NotFoundException if no user is found.
     */
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

    /**
     * 
     * @param {string} id - The ID of the user
     * @param {UpdateUserDto} updateUserDto - Data Transfer Object for updating user
     * @returns {Promise<UserDto>} - Promise of type UserDto
     * 
     * This method updates a user's details by their id.
     * It checks if a user with the provided email (from the update DTO) already exists to avoid duplicates,
     * then updates the user details and returns the updated user.
     */
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

    /**
     * 
     * @param {string} id - The ID of the user
     * @returns {Promise<void>} - Promise of type void
     * 
     * This method deletes a user by their id.
     * It first checks if the user exists, if not, it throws a NotFoundException.
     * If the user exists, it removes the user.
     */
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

    /**
     * 
     * @returns {Promise<UserDto[]>} - Promise of type array of UserDto
     * 
     * This debug method retrieves all users from DynamoDB.
     * This may not be necessary for the final application and could be removed or secured.
     */
    async getUsers() : Promise<UserDto[]> {
        const users = await this.User.scan({});
        console.log(users);
        if (!users) {
            throw new NotFoundException('Users not found');
        }
        return users;
    }

}
