# BE2-NC-Knews

This application provides an API service to interact with the NC-Knews system (read/write). 

## Getting Started

### Prerequisites

It is assumed that VS code (or another appropriate alternative) runs on your machine. 

You also need node and npm installed on your machine.

### Installing

#### Get the code

Fork the project from git. Then copy the git url and in the appropriate folder on your machine:

```
git clone <url from git>
```
This will create the project on your local machine. Open the project in VS code (or alternative app).

#### Install dependencies

Run the following to install body-parser, chai, express, nodemon, knex, mocha, pg & supertest. 

```
npm install 
```

If you intend to create your own package.json then the libraries mentioned above need to be mentioned in the install command:

```
npm install body-parser, chai, express, knex, mocha, pg & supertest

npm install -dev nodemon
```
Once all required dependencies are installed, you can check the node_modules folder (which should be created now) to see if the folders for each of these libraries exists.

## Running the tests

The project uses mocha, chai and supertest to run the automated tests. The spec is split into 2 categories: API and Utilities.

### API Test

This tests all the methods and end-points made available to the client. It also has tests for unhandled methods. 

Before every test, the database is seeded (tables are dropped then created and finally data is re-inserted) to ensure there is consistent data for every test.

The test suite is split by child test suites which test each end point and each of these child test suites have their child test suites to cover each handled method and one unhandled method. 

### Utilities Test

This tests the util methods used to manipulate the data.

## Running the app

In order to run the app you can either run node on listen.js or use nodemon. Regardless of how you do it, you need to create and seed the database first. 

The data used to seed the database exists in: ./db/data/env-data where env is development by default unless you specifically change the process.env.NODE_ENV.

### Create the database:

```
npm run setup-dbs
```
### Drop and re-create the tables

```
npm run migrate-update
```
### Seed the database

```
npm run seed
```

## Deployment

You can deloy the application on [Heroku](http://heroku.com). Create an account in the website if you don't have one already then in the command line:

### Setup Heroku

1. Log into Heroku:
```
heroku login
```

2. Create an app (app-name should be a unique app name):
```
heroku create <app-name>
```

3. Push to heroku:
```
git push heroku master
```
If you do not have heroku as a remote then do this first:
```
git add remote heroku <heroku url which it would have given you before>
```

4. In the Heroku website, add the Postgres database by searching for it in the **add-on** section of the app's dashboard. Choose hobby for the plan unless you intend to use the database heavily (in which case you choose a pay plan).

5. Click on the database it has created then on settings.

6. Click on **view credentials** and copy the URI somewhere so you can compare it with output of the next step.

7. On your command line, type the following then compare the output with what you copied from step 6:
```
heroku config:get DATABASE_URL
```

8. You then need to modify your code slightly to handle the **production** environment (which Heroku uses):

### Code changes for Heroku

#### knexfile.js:

Add the following to the top of the file

```js
const { DB_URL } = process.env;
````

Then where you have the development and test settings, add:

```js
 production: {
    connection: `${DB_URL}?ssl=true`,
  },
```

#### db/data/index.js:

Add the following to get the production data to use development. 

```js
const data = { test, development , production: development};
```
*If you intend to populate with another set of data for production, create the folder inside db/data called production-data then in the index.js add: *
```js
const production = require('./production-data');
```
...and
```js
const data = { test, development , production};
```


#### db/connection.js:

Replace the current file with this so that the database url is picked up from the processs.env for production:

```js
const ENV = process.env.NODE_ENV || 'development';
const config = ENV === 'production' ? { client: 'pg', connection: process.env.DATABASE_URL } : require('../knexfile');

module.exports = require('knex')(config);

```

#### listen.js:
Since the app in Heroku runs on one of many Heroku servers, you have no control over the port so you need to let Heroku set this. By default, it'll be 9090 (if nothing is set on process.env.PORT):

```js
const { PORT = 9090 } = process.env;

app.listen(PORT, () => console.log(`listening on ${PORT}`));

```

#### package.json:
Add the production scripts to create and populate the production database and for Heroku to start the app:

```json
{
  "scripts": {
    "start": "node listen.js",
    "seed:prod": "NODE_ENV=production DB_URL=$(heroku config:get DATABASE_URL) knex seed:run",
    "migrate:latest:prod": "NODE_ENV=production DB_URL=$(heroku config:get DATABASE_URL) knex migrate:latest",
    "migrate:rollback:prod": "NODE_ENV=production DB_URL=$(heroku config:get DATABASE_URL) knex migrate:rollback",
  }
}
```

Once you've done all of these changes, create and seed the database **in this order**:

```
npm run migrate:rollback:prod
npm run migrate:latest:prod
seed:prod
```

Then commit and push your code to Heroku. Once it's done, check your app using the weblink Heroku gives or using the following on command line:

```
heroku open
```

## Authors

* **Fatmeh Shuman** - [theshumanator](https://github.com/theshumanator)


## Acknowledgments

* Northcoders
* Rory github