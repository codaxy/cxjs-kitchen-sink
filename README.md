# CxJS Enterprise Demo

The purpose of this project is to demonstrate capabilities of CxJS on a real-world like application. CxJS is an advanced JavaScript framework designed for building large enterprise applications which commonly feature forms, tables, and charts.

A live demo of this application can be found at https://enterprise-kitchen-sink.cxjs.io.

The following modules are currently implemented:

- Administration
- Accounting

## Development

The application consists of three parts:

- Postgres database
- Node.js based API server
- CxJS based browser application

### Setting Up

Before starting the application on your computer you should create a new Postgres database and use [this script](todo) to populate it. After that find the `.sample.env` configuration file in `server/prisma` and copy it to `.env`. Inside the newly create file, set the connection string to the database created in the previous step.

To start the server open the terminal and run:

```
cd server
yarn install
yarn start
```

To start the client open the terminal and run:

```
cd client
yarn install
yarn start
```

## License

This project is available under the [MIT license](LICENSE.md), however please note that CxJS requires paid licenses for commercial distribution.
