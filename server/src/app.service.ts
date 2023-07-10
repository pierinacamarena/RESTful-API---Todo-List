import { Injectable } from '@nestjs/common';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';


@Injectable()
export class AppService {

  getHello(): string {
    return 'Hello World!';
  }
}
