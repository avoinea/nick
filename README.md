# Nick: Nearly Headless CMS

## Introduction

[Nick](https://nick.docs.plone.org) is a (nearly) headless CMS written in Node.js which provides a RESTful hypermedia API. The API is compatible with the [REST API](https://plonerestapi.readthedocs.io/en/latest/) of the [Plone CMS](http://plone.org) and can be used together with the web frontend [Volto](https://voltocms.com/).

## Documentation

[https://nick.docs.plone.org](https://nick.docs.plone.org)

## Getting started

A live demo of Nick with the latest release is available at:

[https://nick.demo.plone.org](https://nick.demo.plone.org)

Example `GET` request on the portal root

    curl -i https://nick.demo.plone.org -H "Accept: application/json"

## Installation

### Prerequisites

- [Node.js](https://nodejs.org/)
- [PostgreSQL](https://www.postgresql.org/)

### Create Database

    $ CREATE DATABASE "nick";
    $ CREATE USER "nick" WITH ENCRYPTED PASSWORD 'nick';
    $ GRANT ALL PRIVILEGES ON DATABASE "nick" TO "nick";
    $ ALTER DATABASE "nick" OWNER TO "nick";

### Bootstrap Project

    $ pnpm install
    $ pnpm bootstrap

## Development

### Run backend

    $ pnpm start

### Testing

    $ pnpm test

## Yeoman Generator

If you want to create your own project and use Nick as a dependency you can use the Yeoman generator package for that. This way you are able to customize your project without making changes to the core of Nick.

### Installation

First, install [Yeoman](http://yeoman.io) and @plone/generator-nick using [npm](https://www.npmjs.com/) (we assume you have pre-installed [node.js](https://nodejs.org/)).

    $ npm install -g yo
    $ npm install -g @plone/generator-nick
    $ npm install -g corepack@latest
    $ corepack enable pnpm

### Creating a new project

    $ yo @plone/nick my-nick-project

This will bootstrap a new Nick project inside the current folder.

### Create Database

Connect to the PostgreSQL console and create a database and a user with the correct permission using the following commands:

    $ CREATE DATABASE "my-nick-project";
    $ CREATE USER "my-nick-project" WITH ENCRYPTED PASSWORD 'my-nick-project';
    $ GRANT ALL PRIVILEGES ON DATABASE "my-nick-project" TO "my-nick-project";
    $ ALTER DATABASE "my-nick-project" OWNER TO "my-nick-project";

### Boostrap the project

Then bootstrap Nick with:

    $ cd my-nick-project
    $ pnpm bootstrap
    $ pnpm start

## Docker image

Install [Docker Desktop](https://www.docker.com/get-started/).

### Backend

Navigate to the root of the repository, and run the following command to run the Docker container for backend.

```shell
docker compose up --build
```

This will expose port `8080`.
You can make requests to `http://localhost:8080/` to fetch content.

To shut down the containers, run the following command.

```shell
docker compose down
```

## Contribute

- Issue tracker: [https://github.com/plone/nick/issues](https://github.com/plone/nick/issues)
- Source Code: [https://github.com/plone/nick](https://github.com/plone/nick)
- Documentation [https://nick.docs.plone.org](https://nick.docs.plone.org)

## Support

If you are having issues, please let us know via the [issue tracker](https://github.com/plone/nick/issues).

## License

MIT License. Copyrights hold Plone Foundation.
See [LICENSE.md](LICENSE.md) for details.
