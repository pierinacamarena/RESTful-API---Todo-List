import { Injectable } from '@nestjs/common';
// import * as AWS from 'aws-sdk';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';


@Injectable()
export class AppService {
  private dynamoDb: DynamoDBClient;

  constructor() {
    this.dynamoDb = new DynamoDBClient({
      region: 'eu-west-3',
      endpoint: 'http://localhost:4566'
    });
  }

  getHello(): string {
    return 'Hello World!';
  }
}
