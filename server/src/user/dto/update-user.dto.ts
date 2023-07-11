import { IsEmail, IsOptional, IsNotEmpty, MinLength,} from "class-validator";
/**
 * Define user input format
 */

export class UpdateUserDto {
    @IsOptional()
    readonly name: string;
  
    @IsOptional()
    @IsEmail()
    readonly email: string;

    @IsOptional()
    @MinLength(8)
    readonly password: string;
}