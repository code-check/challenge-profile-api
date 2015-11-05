# Profile API

The goal of this challenge is to perform CRUD operations on user profile using RESTful API

The API will have 4 options for managing challenges;
 - ` GET ` : Show user details based on id
 - ` DELETE ` : Remove user based on id
 - ` POST ` : Create new user 
 - ` PUT ` : Update user details based on id

## Specifications
 - All API endpoints will be the following: "/api/users/[id]", where [id] is optional
 - The database used is SQLite, the file should be [profileChallenge.db](./sql/profileChallenge.db)
 - Any data in the body, either request or response, should be JSON 

## Test
- We want you to implement some REST APIs by using any languages and frameworks.
- You can see the specification of APIs in [spec](spec) directory.
  - These specs are written with [api-first-spec](https://github.com/shunjikonishi/api-first-spec), and has some API tests.
- Your goal is to develop a web application which be able to pass all these tests.

## How to solve the test
This test requires
- Some web application framework
- SQLite database
- GitHub account(To fork this repository.)


## How to update database schema
- Original DDL is in [sql/create.sql](./sql/create.sql)

## How to run the api-first-spec test
api-first-spec uses [Mocha](http://mochajs.org/) test framework.

You can run all tests with following commands.

``` bash
cd challenge-profile-api
npm install
mocha spec/*
```

Of course you can try running a single test.

``` bash
mocha spec/create.spec.js
```

As default, application settings are defined in [spec/config/config.json](spec/config/config.json).  
You can edit it according to your requirement.
