# CxJS Enterprise Demo

The purpose of this project is to illustrate how CxJS can be used to quickly build enterprise applications. [CxJS](https://cxjs.io) is an advanced JavaScript framework designed for building applications which heavily feature forms, tables, and charts.

A live demo of this application is available at https://kitchen-sink.cxjs.io.

The following modules are implemented:

- Administration
- Accounting

## Development

The application consists of three parts:

- Postgres database
- Node.js based API server
- CxJS based browser application

### Setting Up

Before starting the application on your computer, you should create a new Postgres database and use [the seed SQL script](./seed/dump.sql) to populate it. After that find the `.sample.env` configuration file in `server/prisma` and rename it to `.env`. Inside the newly created file, set the connection string to the database created in the previous step.

### Running

To start the server, open the terminal and run:

```
cd server
yarn install
yarn start
```

To start the client, open another terminal and run:

```
cd client
yarn install
yarn start
```

## Recipes

Recipes offer additional explanations related to CxJS and this project in particular. These are currently available recipes:

- [Improved form validation UX using the visited flag](./recipes/improved-validation-ux-using-visited.md)
- [Automatic deployment to Heroku and Netlify](./recipes/automatic-deployment-to-heroku-and-netlify.md)

## License

This project is available under the [MIT license](LICENSE.md). However please note that CxJS requires paid licenses for commercial distribution.
