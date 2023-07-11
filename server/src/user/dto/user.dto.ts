import { IsString, IsEmail } from 'class-validator';

export class UserDto {
    @IsString()
    id: string;

    @IsString()
    name: string;

    @IsEmail()
    email: string;

    @IsString()
    password: string;
}
