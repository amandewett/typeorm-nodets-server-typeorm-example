# TypeORM NodeTS server with Typescript, Express and MySQL example

### Requirements
- It requires NODE v13.2.0 or above to run in your machine.
- Please add .env file with variables available in .env.sample file at root of the project.
- Install TYPEORM module globally using:
```sh
npm i -g typeorm
```

## Setup
- Init typeorm project using below command
```sh
npx typeorm init --name project-name --database mysql
```
- Install express, node, typescript, ts-node, tslib as Dev dependencies.
```sh
npm i -D @types/express @types/node nodemon typescript ts-node tslib
```
- Configure tsconfig.json according to your needs or take example from this project.


## Installation
Install the dependencies and devDependencies and start the server.
```sh
npm i
```
## Run in development mode
```sh
npm run dev
```

## Directly run in typescript language (This will not emit your app to javascript in dist folder)
```sh
npm start
```

## Run in production mode
```sh
npm run prod
```