import { IsNotEmpty, IsBoolean, IsOptional } from 'class-validator';

export class UpdateTaskDto {
  @IsOptional()
  userId?: string;

  @IsOptional()
  title?: string;

  @IsOptional()
  description?: string;

  @IsBoolean()
  @IsOptional()
  completed?: boolean;

  @IsBoolean()
  @IsOptional()
  inProgress?: boolean;
}
