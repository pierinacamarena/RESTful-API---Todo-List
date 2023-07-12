import { Injectable } from '@nestjs/common';
import { DynamoDBClient, ListTablesCommand, CreateTableCommand, DescribeTableCommand} from '@aws-sdk/client-dynamodb';
import { Table } from 'dynamodb-onetable'

const Match = {
    ulid: /^[0123456789ABCDEFGHJKMNPQRSTVWXYZ]{26}$/,
    email: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    name: /^[a-z0-9 ,.'-]+$/i,
    password: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
}

const MySchema = {
    format: 'onetable:1.1.0',
    version: '0.0.1',
    indexes: {
        primary:        {hash: 'pk', sort: 'sk'},
        gs1:            {hash: 'gs1pk', sort: 'gs1sk', follow: true},
        gs2:            {hash: 'email'},
        gsUserTasks:    {hash: 'userId'}
    },
    models: {
        User: {
            pk:         { type: String, value: 'user:${id}' },
            sk:         { type: String, value: 'user:' },
            id:         { type: String, generate: 'ulid', validate: Match.ulid },
            name:       { type: String, required: true, validate: Match.name },
            email:      { type: String, required: true, validate: Match.email },
            password:   { type: String },
            
            //Search by user name or by type
            gs1pk: {type: String, value: 'user#' },
            gs1sk: {type: String, value: 'user#${name}#{id}' }
        },
        Task: {
            pk:             { type: String, value: 'user#:{userId}' },
            sk:             { type: String, value: 'task#:{id}' },
            id:             { type: String},
            userId:         { type: String, required: true},
            title:          { type: String, required: true },
            description:    { type: String },
            completed:      { type: Boolean, default: false} ,
            inProgress:     { type: Boolean, default: false },
            createdAt:      { type: Date},
            updatedAt:      { type: Date},

            //Search by task name or by type
            gs1pk:          { type: String, value: 'task#'},
            gs1sk:          { type: String, value: 'task#${title}'},
            gsUserTasks:    { type: String, value: 'user#${userId}'},
        },
    },
    params: {
        'isoDates' : true,
        'timestamps': true,
    },
}

@Injectable()
export class DynamodbService {
    public readonly table: Table;
    public readonly client: DynamoDBClient;

    constructor() {
        this.client = new DynamoDBClient({
            region: 'eu-west-3',
            endpoint: 'http://127.0.0.1:4566',
            credentials: {
                accessKeyId: 'dummy',
                secretAccessKey: 'dummmy',
            }
        });
        this.table = new Table({
            client: this.client,
            name: 'MyTable',
            schema: MySchema,
            partial: false,
        });

        this.createTableIfNotExists();
    }

    private async createTableIfNotExists() {
        const listTablesCommand = new ListTablesCommand({});
        const tableList = await this.client.send(listTablesCommand);

        if (!tableList.TableNames.includes('MyTable')) {
            console.log("creating table");
            const createTableCommand = new CreateTableCommand({
                AttributeDefinitions: [
                    { AttributeName: "pk", AttributeType: "S" },
                    { AttributeName: "sk", AttributeType: "S" },
                    { AttributeName: "gs1pk", AttributeType: "S" },
                    { AttributeName: "gs1sk", AttributeType: "S" },
                    { AttributeName: "email", AttributeType: "S" },
                    { AttributeName: "userId", AttributeType: "S" },
                ], 
                KeySchema: [
                    { AttributeName: "pk", KeyType: "HASH" },
                    { AttributeName: "sk", KeyType: "RANGE" },
                ], 
                ProvisionedThroughput: {
                    ReadCapacityUnits: 5, 
                    WriteCapacityUnits: 5
                }, 
                TableName: "MyTable",
                GlobalSecondaryIndexes: [
                    {
                        IndexName: 'gs1',
                        KeySchema: [
                            { AttributeName: "gs1pk", KeyType: "HASH" },
                            { AttributeName: "gs1sk", KeyType: "RANGE" },
                        ],
                        Projection: {
                            ProjectionType: "ALL"
                        },
                        ProvisionedThroughput: {
                            ReadCapacityUnits: 5,
                            WriteCapacityUnits: 5
                        },
                    },
                    {
                        IndexName: 'gs2',  // new GSI
                        KeySchema: [
                            { AttributeName: "email", KeyType: "HASH" },  // new key schema for gsEmail
                        ],
                        Projection: {
                            ProjectionType: "ALL"
                        },
                        ProvisionedThroughput: {
                            ReadCapacityUnits: 5,
                            WriteCapacityUnits: 5
                        },
                    },
                    {
                        IndexName: 'gsUserTasks',  // new GSI
                        KeySchema: [
                            { AttributeName: "userId", KeyType: "HASH" },  // new key schema for gsUserTasks
                        ],
                        Projection: {
                            ProjectionType: "ALL"
                        },
                        ProvisionedThroughput: {
                            ReadCapacityUnits: 5,
                            WriteCapacityUnits: 5
                        },
                    }
                ]
            });

            try {
                const data = await this.client.send(createTableCommand);
                console.log(data);
            } catch (err) {
                console.log(err, err.stack);
            }
        }
    }
}


        // Describe the table to get its details, including global secondary indexes
        // const describeTableCommand = new DescribeTableCommand({
        //     TableName: "MyTable",
        //     });
        //     const describeTableResponse = await this.client.send(describeTableCommand);
        //     console.log("Table description:", describeTableResponse.Table);
        
        //     // Check if the `gsUserTasks` global secondary index exists
        //     const globalSecondaryIndexes = describeTableResponse.Table.GlobalSecondaryIndexes;
        //     const indexExists = globalSecondaryIndexes.some((index) => index.IndexName === "gsUserTasks");
        //     if (indexExists) {
        //     console.log("gsUserTasks index exists");
        //     } else {
        //     console.log("gsUserTasks index does not exist");
        //     }