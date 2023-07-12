import { IsNotEmpty, IsBoolean, IsOptional } from "class-validator";

export class CreateTaskDto {

    id: string;

    pk: string;
    sk: string;

    @IsNotEmpty()
    userId: string;

    @IsNotEmpty()
    title: string;

    @IsOptional()
    description?: string;

    @IsBoolean()
    @IsOptional()
    completed?: boolean;

    @IsBoolean()
    @IsOptional()
    inProgress?: boolean;
}