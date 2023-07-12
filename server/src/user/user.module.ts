import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { DynamodbModule } from 'src/dynamodb/dynamodb.module';
import { TasksModule } from 'src/tasks/tasks.module';

@Module({
    providers: [UserService],
    controllers: [UserController],
    imports: [
        DynamodbModule,
    ],
    exports: [UserService],
})
export class UserModule {}
