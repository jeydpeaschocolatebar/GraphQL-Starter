import 'tsconfig-paths/register';

import compression from 'compression';
import helmet from 'helmet';

import { env } from '@app/config/environment';

import { errorMiddleware, httpLogger, expressStatusMonitor } from '@app/middleware';

import { ping as pingPostgresDatabase } from './db/knex';

import express from 'express';
import { createServer } from 'http';
import { initRoutes } from './routes';
import { initApolloGraphqlServer } from './graphql';
import { corsMiddleware } from './middleware/cors.middleware';

const app = express();

(async () => {
  // Test Postgres DB
  try {
    await pingPostgresDatabase();
  } catch {
    return;
  }

  app.use(express.json());
  app.use(helmet());
  app.use(corsMiddleware());
  app.use(compression());
  app.use(expressStatusMonitor());
  app.use(httpLogger);

  initRoutes(app);

  app.use(errorMiddleware());
  const apolloServer = initApolloGraphqlServer(app);

  // For the subscription server
  const httpServer = createServer(app);
  apolloServer.installSubscriptionHandlers(httpServer);

  httpServer.listen(env.port, () => {
    console.info(`Server is now up @ ${env.port}`);
  });
})();
