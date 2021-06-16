# TypeScript Node Express + Apollo GraphQL Starter

A boilerplate for TypeScript + Node Express + Apollo GraphQL APIs.

## Table of Contents

- [Features](#features)
- [Setup](#setup)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Sample Environment File](#sample-environment-file)
- [Recommended Workflow](#recommended-workflow)
- [Naming Convention](#naming-convention)
- [Deployment](#deployment)
- [Future Plans](#future-plans)
- [Pro Tips](#pro-tips)
- [Contributing](#contributing)
- [License](#license)

## Features

- Login with Email and Password
- Session Management (Access Token + Rotating Refresh Tokens) with [SuperTokens](https://supertokens.io/).
  - [SuperTokens](https://supertokens.io/) is only used for [Session Management](https://supertokens.io/docs/session/introduction) with this setup but it can do more than that. If you need OAuth, read more on the SuperTokens docs on how to setup one easily.
- Node Express REST endpoint examples
- Apollo GraphQL as middleware for Node Express
- Centralized error handling
  - See `src/errors/base.error.ts` and `src/errors/error-handler/index.ts`.
  - For GraphQL, see `src/graphql/index.ts` and look for the `formatError` of Apollo.
  - For REST, see `src/middlewares/error.middleware.ts`.
- Automatic type code generation for GraphQL resolvers with GraphQL Code Generator
- Facebook Dataloader for caching and batching
- PostgreSQL Database
- Adminer for managing the PostgreSQL Database
- Redis for Caching and GraphQL Subscription
- RedisCommander for managing the Redis Database
- Pre-commit hook for auto formatting files with Husky, Lint-Staged and Prettier
- Input schema validation with Yup
- GraphQL Subscription and File Upload examples
- Dockerized containers for both development and production
  - Multi-stage build for production

### Important notes

- If your project has authorization needs, I recommend using [CASL](https://casl.js.org/). If you want to spin your own but not sure how, here's a [good article](https://css-tricks.com/handling-user-permissions-in-javascript/) to get the ideas down.
- For SQL Transactions, please read the [ObjectionJS doc](https://vincit.github.io/objection.js/guide/transactions.html#transactions) and pick how you want to handle yours.

## Setup

![image](https://user-images.githubusercontent.com/6721822/112299294-a093e580-8cd2-11eb-8aee-cd98c6f84952.png)

If the nature of your app isn't CRUDy (for a lack of a better word), you probably need domain models and a good amount of layering + mappers. Here's a [good article on the topic](https://blog.ploeh.dk/2012/02/09/IsLayeringWorththeMapping/). Otherwise, proceed.

## Prerequisites

- [Docker](https://www.docker.com/)
- [NodeJS](https://nodejs.org/)
- TypeScript
- [supertokens-website](https://www.npmjs.com/package/supertokens-website) on your frontend app.
  - For the client-side session management.
  - Read more [here](https://supertokens.io/docs/session/common-customizations/sessions/cookie-consent#cookie-consent) for more info about the specific cookies being used by `SuperTokens`.
  - If you don't use JS for your frontend app, you'll have to make the HTTP requests that `supertokens-website` heavy lifts yourself, such as [refreshing the session when it expires](https://github.com/supertokens/frontend-driver-interface/blob/master/v1.7.1.md#refresh-session).

## Getting Started

```bash
# Install dependencies for the host
npm install

# Generate GraphQL Types
npm run generate:gql-types

# Build the project for the first time or when you add dependencies
docker-compose build

# Start the application (or to restart after making changes to the source code)
docker-compose up
```

**Note:** You might be prompted to share your drive with Docker if you haven't done so previously. The drive letter you need to share in this case would be the drive letter of where this repository resides.

---

If docker compose have bootstrapped all services successfully, you should be able to access:

### GraphQL Endpoint

[http://localhost:8080/graphql](http://localhost:8080/graphql)

### Adminer endpoint

[http://localhost:8888/](http://localhost:8888/)

Credentials:

| Field    | Value      | Notes                                                                                        |
| -------- | ---------- | -------------------------------------------------------------------------------------------- |
| System   | PostgreSQL | `docker-compose.yml` config is using Postgres as the SQL Database so we pick PostgreSQL here |
| Server   | db         | Service name in `docker-compose.yml` file for our Database service is named `db`             |
| Username | postgres   | Default username is `postgres`                                                               |
| Password | password   | As defined in the `docker-compose.yml` config                                                |
| Database | db         | As defined in the `docker-compose.yml` config                                                |

### Redis Commander endpoint

[http://localhost:8889](http://localhost:8889/)

### Node Express REST Health Check endpoint

[http://localhost:8080/api/v1/maintenance/health-check](http://localhost:8080/api/v1/maintenance/health-check)

**Note:** If you prefer a different port, container name, or anything docker environment related. Just modify the `docker-compose.yml` file and adjust to your setup needs.

## Project Structure

| Name                                                    | Description                                                                                                                                                                         |
| ------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **infrastructure**/\*                                   | Put all your infrastructure config files here                                                                                                                                       |
| **infrastructure**/elastic-beanstalk/Dockerrun.aws.json | Sample config for deploying a Docker app to AWS Elastic Beanstalk from a remote Docker repository (AWS ECR for this config). Make sure to replace the placeholders with your setup. |
| **src/config**/\*                                       | Any app level environment configs should go here.                                                                                                                                   |
| **src/db**/helpers/\*.ts                                | Migration script helpers.                                                                                                                                                           |
| **src/db**/helpers/add-timestamps.ts                    | Migration script for adding `createdAt` and `updatedAt` fields to a table.                                                                                                          |
| **src/db**/migrations/\*.ts                             | Generated migration files by KnexJS goes here as per `knexfile.ts` config.                                                                                                          |
| **src/db**/models/`<entity-name>`.model.ts              | Database Models.                                                                                                                                                                    |
| **src/db**/seeds/\*.ts                                  | Generated seed files by KnexJS goes here as per `knexfile.ts` config.                                                                                                               |
| **src/errors**/`<error-name>`.error.ts                  | Custom Errors.                                                                                                                                                                      |
| **src/generated**/\*\*/\*.ts                            | Generated files.                                                                                                                                                                    |
| **src/graphql**/scalars/`<scalar-name>`.scalar.ts       | Custom Scalars and their resolvers.                                                                                                                                                 |
| **src/graphql**/enums/index.ts                          | GraphQL Enum resolvers and internal values.                                                                                                                                         |
| **src/graphql**/index.ts                                | Apollo GraphQL setup.                                                                                                                                                               |
| **src/graphql**/schema.ts                               | GraphQL Schema/Resolver builder script.                                                                                                                                             |
| **src/graphql**/init-loaders.ts                         | Collect all dataloaders here.                                                                                                                                                       |
| **src/graphql**/pubsub.ts                               | Initialize pubsub engine here.                                                                                                                                                      |
| **src/middlewares**/`<middleware-name>`.middleware.ts   | Node Express Middleware files.                                                                                                                                                      |
| **src/modules**/`<module-name>`/\*                      | Your feature modules.                                                                                                                                                               |
| **src/modules**/\_/\*                                   | Reserved module. Contains root schema for graphql to work along with some sample resolvers.                                                                                         |
| **src/redis**/client.ts                                 | Redis client is initialized here.                                                                                                                                                   |
| **src/shared**/                                         | Anything that's shared (generic) throughout the app should be placed here.                                                                                                          |
| **src/utils**/`<utility-name>`.util.ts                  | Utility files.                                                                                                                                                                      |
| **src/app.ts**                                          | Main application file.                                                                                                                                                              |
| .commitlintrc.json                                      | Commitlint config.                                                                                                                                                                  |
| .dockerignore                                           | Folder and files ignored by Docker.                                                                                                                                                 |
| .eslintignore                                           | Folder and files ignored by ESLint.                                                                                                                                                 |
| .eslintrc.js                                            | Linter rules are defined here.                                                                                                                                                      |
| .gitignore                                              | Folder and files that should be ignored by git.                                                                                                                                     |
| .huskyrc                                                | Husky config. Git hooks made easy.                                                                                                                                                  |
| .lintstagedrc                                           | Lint-Staged config. Run commands against staged git files.                                                                                                                          |
| .prettierrc                                             | Prettier config. An opinionated code formatter.                                                                                                                                     |
| apollo.config.js                                        | For apollo tooling. Read more [here](https://www.apollographql.com/docs/devtools/apollo-config/).                                                                                   |
| codegen.yml                                             | GraphQL Code Generator (file watcher) config file.                                                                                                                                  |
| docker-compose.yml                                      | Docker compose config file.                                                                                                                                                         |
| Dockerfile                                              | `Production` Docker config file.                                                                                                                                                    |
| Dockerfile.dev                                          | `Development` Docker config file used by `docker-compose`.                                                                                                                          |
| knexfile.ts                                             | KnexJS config which contains the database config.                                                                                                                                   |
| gulpfile.ts                                             | Gulp task runner config file.                                                                                                                                                       |
| tsconfig.json                                           | Contains typescript config for this project.                                                                                                                                        |

**Note:** This project structure makes use of **barrel files**, those **index.ts** you see on most of the folders. Make sure not to forget to export your newly created files to their respective **barrel files (index.ts)** if applicable!

## Sample Environment File

```dotenv
# Make sure to set this to "production" in production environments
NODE_ENV=

# If you want to change the app port. Defaults to 8080.
APP_PORT=

# DB Connection URLs
POSTGRES_CONNECTION_URL=
REDIS_CONNECTION_URL=

# Apollo Graph Manager
APOLLO_KEY=
```

See files inside `src/config/*` that uses `process.env`. Those are the environment variables that you can configure.

## Recommended Workflow

### Create a migration script with KnexJS for your database table

1. Run `npm run migrate:make <script_name>`.
1. Go to the generated script at `src/db/migrations/<your_script>.ts`.
1. Populate the script accordingly. Use the `addTimestamps.ts` helper if you need timestamps for your table.

### (Optional) Create a seed script with KnexJS

1. Run `npm run seed:make <script_name>`.
1. Go to the generated script at `src/db/seeds/<your_script>.ts`.
1. Populate the script accordingly.

### Create the corresponding ObjectionJS model

1. Create a TS file at `src/db/models/`.
1. Populate the file accordingly.
   - Make sure to set the static `tableName` property.
   - (Optional) Set the static `relationMappings` property if applicable. See ObjectionJS docs for more details.
   - (Recommended) Create a static `yupSchema` property for a centralized schema validation definition for that model. See existing models for example.
   - Setup the model's properties based on your database table schema.

### Create a folder for your Feature Module

1. Create one under the `src/modules/<module_name>` directory.

### Create a Use Case (and/or Services)

1. Create a use case TS file under your module.
   - Should be under `src/modules/<module_name>/use-cases/<use_case_name>.use-case.ts`
1. Create the DTO interface for your use case.
1. Create a schema validator for your DTO.
1. Check for auth requirements if applicable.
1. Validate DTO.
1. Write your business logic for the use case.
   - If some operations warrants a service, don't hesitate to create one.
1. Make sure to return an object-like data on your use case functions so that you can easily extend the results if needed.
   - Unless it's a write operation and is idempotent in nature, then you might not need to return anything.

**Important:**

- Your Interface Layer shouldn't do any DB Operations directly.
- Use cases should never call another use case. There will be tight coupling if you do that. In the case you decide to change a parameter or behavior on the child use case, the dependent use case would've to adjust accordingly.
- If you foresee an operation that you think will be reused whether by the same module or other modules, put it in a service and let this service be called by the module that wants to use it.

### GraphQL - Create the type definitions for your entity

1. Create a GraphQL file (`.graphql`) under a graphql folder of your module: `src/modules/<module_name>/graphql/`.
   - The folder structure convention is important. This particular path is being used by GraphQL Code Generator and `graphql-tools/load-files` to locate your type definitions.
1. Define your GraphQL SDL.
1. Think in graphs.
   - Your schema doesn't necessarily have to be a reflection of your database schema.

### GraphQL - Create a factory for your entity type

1. If not yet present, create a new folder named `factories` under `src/modules/<module_name>/`.
1. Create a graphql factory file under that folder.
   - Recommended file name should be in the format: `<graphql-object-type-name>.graphql-factory.ts`
1. Create the main factory function inside the file:

   - Recommended function name should be in the format: `createGQL_<graphql-object-type-name>`
   - Make sure to specify the return type of this function to the equivalent GraphQL Object Type generated by GraphQL Code Generator.
   - Example:

     ```ts
     export createGQL_User(user: UserModel): GQL_User {
       // ...
     }
     ```

### GraphQL - Create your resolvers

1. If not yet present, create a new folder named `resolvers` under `src/modules/<module_name>/graphql/`.
1. Create an `index.ts` file under the folder.
   - **Note:** This is important as `src/graphql/schema.ts` uses the `index` barrels (TS files) to load the resolvers.
1. Create the `query/mutation/subscription` resolver file under the folder.
1. Implement. Refer to the resolvers under `user` for examples.

**Tip:** Keep your resolvers thin by making the business logic layer (use cases) do the actual work and calling those in the resolvers.

If you have enums defined in your GraphQL Schema, most likely you have your own internal values which means you'll have to resolve these enums to match your internal values which, most of the time, are internal enums you use in the app. Simply define the enums under the `src/graphql/enums` directory and make sure to export it on the `index` barrel.

This is also true to scalars at `src/graphql/scalars`.

### REST - Define routes

1. If not yet present, create a new folder named `routes` under `src/modules/<module_name>/`.
1. Create an `index.ts` file inside that folder.
   - **Note:** This file will contain all your route definitions (router) for that module.
   - **Important:** Do not forget to import this router on `app.ts`.
1. Define the router. See existing index files for examples.

### REST - Define route handlers

1. If not yet present, create a new folder named `handlers` under `src/modules/<module_name>/routes/`.
1. Create a route handler file under that folder.
   - Recommended file name should be in the format: `<graphql-object-type-name>.handler.ts`
1. Implement. Refer to the route handlers under `user` for examples.
1. Add this route handler to your router.
   - Make sure to wrap this with the async handler util.

## Naming Convention

### For files and folders

Generally, use `snake-case`.

In most cases, we include the file `functionality` in its file name in the format:

`<file-name>.<functionality>.<extension>`

For example:

- get-users`.use-case`.ts
- sort-direction`.enum`.ts
- user`.model`.ts
- async-handler`.util`.ts

TypeScript `Interface` and `Type` file names should match their definition name.

For example:

| Interface/Type name       | File name                    |
| ------------------------- | ---------------------------- |
| `ICursorPaginationResult` | `ICursorPaginationResult`.ts |
| `ICursorResult`           | `ICursorResult`.ts           |
| `IPageInfo`               | `IPageInfo`.ts               |
| `UniqueID`                | `UniqueID`.ts                |
| `Maybe`                   | `Maybe`.ts                   |

## Deployment

### **SuperTokens Core**

Read more on the SuperTokens [docs based on your infrastructure](https://supertokens.io/docs/session/quick-setup/core/with-docker).

Make sure to configure the [database setup](https://supertokens.io/docs/session/quick-setup/database-setup/postgresql).

### **Node App**

There are a few ways to go about this and can vary based on your setup.

### Docker Way

Simply build the image from your local machine (or let your CI tool do it) with the syntax below.

```bash
# The dot on the end is important.
docker build -f <docker_file> -t <image_name>[:<image_tag>] .

# Example:
docker build -f Dockerfile -t graphql-starter:latest .
```

Then push the image you just built from your local machine (or from your CI tool) to your docker image repository (e.g. Docker Hub, AWS ECR).

```bash
docker push <typically_a_url_to_your_docker_image_repository>
```

Let your host server pull this image and run it from there.

**Note:** Typically, the `tag` for the image you built should match the `url` to your docker image repository. Refer to your image repository provider for specific details.

**Extra:** If you want to test the image you just built with your local setup, then configure the docker-compose file such that it points to your image instead of building from a Dockerfile. For example:

From:

```yaml
services:
  api:
    build:
      context: .
      dockerfile: Dockerfile.dev
    command: npm start
    volumes:
      - .:/usr/src/app
      - /usr/src/app/node_modules
    restart: always
```

To:

```yaml
services:
  api:
    # Set it to the image you just built
    image: graphql-starter:latest
    restart: always
```

### Build Locally

If you're not using Docker, you can still get your hands on the build files. Normally, you'd want this approach if you're deploying to a VPS and have to move the files via FTP manually to your server or you have a cloud provider that accepts node apps where you'll have to provide it your project files with a `package.json` file in the project folder (typically zipped).

Build the project:

```bash
npm run build --prod
```

This will create a `build` folder in the project directory which you can deploy.

**Note:** You might need to manually install the dependencies yourself if you're using a VPS. Otherwise, your cloud provider's NodeJS container will typically just need a `package.json` from the root folder and they'll do the installation on every deploy.

## Future Plans

- Use GitHub Actions for CI/CD
- Migrate from bcrypt to argon2
- Tests with Jest

## Pro Tips

- When resolver types are generated by GraphQL Code Generator, the type of the 1st parameter of a **field resolver** is the parent type by default. This is not always true because at runtime, what the parent resolver returns is the actual type/object that will arrive in the field resolver 1st (parent) parameter. In cases like this, you'd need to type assert the parent. See `full-name.query.ts`.

  - Another example for this is let's say we have a `pets` table and a pet has an `ownerId` but in your GraphQL Schema, what you expose is `owner` and not `ownerId`. You won't have access to the `ownerId` in your resolver because GraphQL Code Generator generated what you defined in the schema. You'll have then to type assert in your resolver the type you know you returned.

- If you want to rename a field in your GraphQL Schema:

  - **DO NOT** rename first on the GraphQL schema file (`*.graphql`).
    - Because if you do, the files that references the to-be-renamed field will break and TypeScript will fail to compile.
    - GraphQL Code Generator only generates what's defined in the schema and overwrites the generated file so the old name that was previously being referenced is now missing.
  - What you **SHOULD DO** instead is:
    - Rename first the field in the generated graphql type definition file by GraphQL Code Generator at `src/generated/graphql/index.ts` then apply the new name in the GraphQL schema file.
      - Saves your time and sanity.

- When trying to auto import a GraphQL resolver to its respective index barrel (`index.ts` file), you might notice you're not getting code completion when typing the resolver name in the `export default` object. This is normal because your IDE thinks you're typing the key/property name (remember key-value pair).

- When trying to debug async functions in VSCode and the breakpoints on the inner lines won't hit, try adding `trace: true` to `launch.json` file.

- Generated custom scalars by GraphQL Code Generator are given a type of `any`. As with TypeScript, if you can help it, give it a type/interface then map it to GraphQL Code Generator. See `Upload.scalar.ts` (the exported _type_) and `codegen.yml` (_scalars_ section) files. You can [read more here](https://graphql-code-generator.com/docs/plugins/typescript#scalars-scalarsmap). But basically:

  1. You define the type/interface in the corresponding scalar file and export it.
  2. Then map it to GraphQL Code Generator by adding scalars config in `codegen.yml` such that it points to its corresponding scalar file.
     - Format is: `<Scalar_Name_in_GQL_Schema>: <path_to_custom_type>#<name_of_type>`

- If you're using this repo template with Docker Windows, you'll notice that when you save any file, the watchers aren't reacting. This has something to do with Linux not being able to detect file changes from Windows because the file system events are not being propagated down to Linux. You'll have to resort to polling mechanisms in that case for any tools that watches file changes. I recommend using WSL and developing inside WSL instead.

- If you want to boost your knowledge about GraphQL, I highly recommend reading the e-book: [Production Ready GraphQL](https://book.productionreadygraphql.com/) by Marc-Andre Giroux.

## Contributing

If something is unclear, confusing, or needs to be refactored, please let me know. Pull requests are always welcome but do consider the opinionated nature of this project. Please open an issue before submitting a pull request.

## License

MIT License

Copyright (c) 2019-2021 Cerino O. Ligutom III

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
