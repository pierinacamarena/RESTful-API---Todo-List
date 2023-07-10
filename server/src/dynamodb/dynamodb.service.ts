import { Injectable } from '@nestjs/common';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
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
        primary:    {hash: 'pk', sort: 'pk'},
        gs1:        {hash: 'gs1pk', sort: 'gs1sk', follow: true},
    },
    models: {
        User: {
            pk:         { type: String, value: 'user#:${id}' },
            sk:         { type: String, value: 'user#:${id}' },
            id:         { type: String, generate: 'ulid', validate: Match.ulid },
            name:       { type: String, required: true, validate: Match.name },
            email:      { type: String, required: true, validate: Match.email },
            password:   { type: String },
            
            //Search by user name or by type
            gs1pk: {type: String, value: 'user#' },
            gs1sk: {type: String, value: 'user#${name}#{id}' }
        },
        Task: {
            pk:             { type: String, value: 'task#{id}' },
            sk:             { type: String, value: 'task#{id}' },
            id:             { type: String, generate: 'ulid', validate: Match.ulid },
            userId:         { type: String, required: true },
            title:          { type: String, required: true },
            description:    { type: String },
            completed:      { type: Boolean, default: false},
            inProgress:     { type: Boolean, default: false},
            createdAt:      { type: Date},
            updatedAt:      { type: Date},

            //Search by task name or by type
            gs1pk:          { type: String, value: 'task#'},
            gs1sk:          { type: String, value: 'task#${title}'}
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

    constructor() {
        const client = new DynamoDBClient({
            region: 'eu-west-3',
            endpoint: 'http://localhost:4566'
        });
        const table = new Table({
            client: client,
            name: 'MyTable',
            schema: MySchema,
            partial: false,
        })
    }
}
