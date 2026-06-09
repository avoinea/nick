# Yeoman Nick App Generator

@plone/generator-nick is a Yeoman generator that helps you to set up Nick via command line.

## Installation

First, install [Yeoman](http://yeoman.io) and @plone/generator-nick using [npm](https://www.npmjs.com/) (we assume you have pre-installed [node.js](https://nodejs.org/)).

```bash
npm install -g yo
npm install -g @plone/generator-nick
```

## Usage

### Creating a new Nick project using `npm init`

```bash
npm init yo @plone/nick
```

This is the shortcut for using `npm init` command. It uses Yeoman (`yo`) and `@plone/generator-nick` and execute them without having to be installed globally.

Answer the prompt questions to complete the generation process.

### Creating a new Nick project

```bash
yo @plone/nick
```

This will bootstrap a new Nick project inside the current folder.

### Start Nick with `pnpm start`

Start Nick with:

```bash
pnpm start
```

This runs the project in development mode.

Consult the Nick docs for further details:

https://nick.docs.plone.org

### Run unit tests with `pnpm test`

Runs all the tests.

### Update translations with `pnpm i18n`

Runs the test i18n runner which extracts all the translation strings and generates the needed files.
