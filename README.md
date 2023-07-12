# RESTful-API---Todo-List
The project involves creating a RESTful API that will allow a user to manage a task list<br />
<br />
Tech StacK:<br />
  -Backend Framework: Nest (https://nestjs.com/)<br />
  -Plugin: OneTable: https://doc.onetable.io/<br />
  -Database: DynamoDB: https://aws.amazon.com/dynamodb/<br />

This project allows to manage a todo list, create a user, verifies if another user with the same email exist to avoid duplicate,<br />
this was done with the intention of setting up an authentication system later, <br />
the user password is hashed for security<br />

### User actions:<br />
  -Create a User<br />
  -Delete a user<br />
  -Update a user, (the update allows for partial changes of the user, name, email)<br />
  -Get a user by id<br />
  -Get all users, this route was used for debugging as the aws was unavailable at my school computer and i have no sudo rights<br />
<br />
### Task Actions:<br />
  -Create task, linked to a user, will check if the userid is of a valid user<br />
  -Delete task<br />
  -Update task, again allows partial update<br />
  -Get task by id<br />
  -Get tasks by user<br />
  -Get all tasks<br />
<br />
The most challenging part of this project was handling the database dynamodb, a nosql database by amazon<br />
<br />
##To start the program <br />
docker-compose-up to start the database<br />
npm run start:dev to start the backend server<br />
it will automatically connect to the database and create the table is it has not been created<br />
for testing:<br />
npm test inside the server folder for some jest unit test<br />
connect via insomnia to the url: htttp://localhost:3000/{INSERTROUTE}<br />
<br />
## Documentation for DynamoDB<br />
https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/SecondaryIndexes.html<br />
https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB.html#createTable-property<br />
<br />
## Documentation for OneTable<br />
https://doc.onetable.io/start/quick-tour/<br />
https://github.com/sensedeep/dynamodb-onetable/tree/main/samples/crud<br />
https://github.com/sensedeep/dynamodb-onetable/tree/main/samples/crud<br />
<br />
## Documentation for Jest Unit tests<br />
https://stackoverflow.com/questions/50091438/jest-how-to-mock-one-specific-method-of-a-class<br />
https://dev.to/dstrekelj/how-to-test-classes-with-jest-jif<br />
https://stackoverflow.com/questions/61315546/is-it-possible-to-spyon-jest-multiple-methods-in-same-module<br />
https://www.softwaretestinghelp.com/jest-testing-tutorial/<br />
