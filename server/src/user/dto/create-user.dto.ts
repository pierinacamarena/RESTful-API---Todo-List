import { IsEmail, IsString, IsNotEmpty, IsNumber, MinLength } from "class-validator";
/**
 * Define user input format
 */

export class CreateUserDto {
    @IsNotEmpty()
    readonly name: string;
  
    @IsNotEmpty()
    @IsEmail()
    readonly email: string;
  
    // @IsNotEmpty()
    // @MinLength(8)
    // readonly password: string;
  }