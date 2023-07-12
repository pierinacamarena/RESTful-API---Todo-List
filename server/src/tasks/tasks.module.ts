import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { DynamodbService } from 'src/dynamodb/dynamodb.service';
import { DynamodbModule } from 'src/dynamodb/dynamodb.module';
import { TasksController } from './tasks.controller';
import { UserModule } from 'src/user/user.module';

@Module({
    providers: [TasksService],
    controllers: [TasksController],
    imports: [
        DynamodbModule,
        UserModule,
    ],
    exports: [TasksService],
})
export class TasksModule {}
