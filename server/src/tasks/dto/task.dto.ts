import {IsString, IsBoolean, isDate, IsDate} from 'class-validator'

export class TaskDto {
    @IsString()
    id: string;
    
    @IsString()
    userId: string;
    
    @IsString()
    title: string;
    
    @IsString()
    description?: string;
    
    @IsBoolean()
    completed: boolean;
    
    @IsBoolean()
    inProgress: boolean;
    
    @IsDate()
    createdAt: Date;
    
    @IsDate()
    updatedAt: Date;
  }
  