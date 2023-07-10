import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserController } from './user/user.controller';
import { TasksController } from './tasks/tasks.controller';
import { TasksService } from './tasks/tasks.service';
import { UserService } from './user/user.service';
import { DynamodbService } from './dynamodb/dynamodb.service';
import { DynamodbModule } from './dynamodb/dynamodb.module';
import { UserModule } from './user/user.module';
import { TasksModule } from './tasks/tasks.module';

@Module({
  imports: [DynamodbModule, UserModule, TasksModule],
  controllers: [AppController, UserController, TasksController],
  providers: [AppService, TasksService, UserService, DynamodbService],
})
export class AppModule {}
