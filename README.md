# RESTful-API---Todo-List
The project involves creating a RESTful API that will allow a user to manage a task list..

This project allows to manage a todo list, create a user, verifies if another user with the same email exist to avoid duplicate,
this was done with the intention of setting up an authentication system later, 
the user password is hashed for security

User actions:
  -Create a User
  -Delete a user
  -Update a user, (the update allows for partial changes of the user, name, email)
  -Get a user by id
  -Get all users, this route was used for debugging as the aws was unavailable at my school computer and i have no sudo rights

Task Actions:
  -Create task, linked to a user, will check if the userid is of a valid user
  -Delete task
  -Update task, again allows partial update
  -Get task by id
  -Get tasks by user
  -Get all tasks

The most challenging part of this project was handling the database dynamodb, a nosql database by amazon

##To start the program 
docker-compose-up to start the database
npm run start:dev to start the backend server
it will automatically connect to the database and create the table is it has not been created
for testing:
npm test inside the server folder for some jest unit test
connect via insomnia to the url: htttp://localhost:3000/{INSERTROUTE}

## Documentation for DynamoDB
https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/SecondaryIndexes.html
https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB.html#createTable-property

## Documentation for OneTable
https://doc.onetable.io/start/quick-tour/
https://github.com/sensedeep/dynamodb-onetable/tree/main/samples/crud
https://github.com/sensedeep/dynamodb-onetable/tree/main/samples/crud

## Documentation for Jest Unit tests
https://stackoverflow.com/questions/50091438/jest-how-to-mock-one-specific-method-of-a-class
https://dev.to/dstrekelj/how-to-test-classes-with-jest-jif
https://stackoverflow.com/questions/61315546/is-it-possible-to-spyon-jest-multiple-methods-in-same-module
https://www.softwaretestinghelp.com/jest-testing-tutorial/
