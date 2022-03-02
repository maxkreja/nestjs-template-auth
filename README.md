# nestjs-template

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository with TypeORM & MySQL. The setup is configured to be run with Docker during development & production.

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

The app exposes a [Swagger](https://swagger.io/) frontend at `localhost:3000/swagger`.

### Docker

```bash
# development
$ npm run shell
```

This will start a shell inside a Docker container, together with a MySQL database
and a phpMyAdmin instance. Use the shell as if you would deveopt directly on your machine:

```bash
# inside docker shell
$ npm install
$ npm run start:dev
```

This will install the dependencies inside the Docker container and runs the app in watch mode.

## Build

```bash
# build docker image
$ docker build -t <image-name> .
```

```bash
# start container
$ docker run <image-name>
```

## License

This template is [MIT licensed](LICENSE.md).
