import { Injectable } from '@nestjs/common';
import { DynamoDBClient, ListTablesCommand, CreateTableCommand, DescribeTableCommand} from '@aws-sdk/client-dynamodb';
import { Table } from 'dynamodb-onetable'


/**
 * Regex patterns for validation
 * @type {{ulid: RegExp, email: RegExp, name: RegExp, password: RegExp}}
 */
const Match = {
    ulid: /^[0123456789ABCDEFGHJKMNPQRSTVWXYZ]{26}$/,
    email: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    name: /^[a-z0-9 ,.'-]+$/i,
    password: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
}

/**
 * Define schema for the table
 */
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

    /**
     * Configuration and table definition
     */

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

    /**
     * Creates a new DynamoDB table if it doesn't exist.
     */
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
                        IndexName: 'gs2', 
                        KeySchema: [
                            { AttributeName: "email", KeyType: "HASH" }, 
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
                        IndexName: 'gsUserTasks', 
                        KeySchema: [
                            { AttributeName: "userId", KeyType: "HASH" },  
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
