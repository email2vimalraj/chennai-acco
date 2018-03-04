const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { graphqlExpress, graphiqlExpress } = require('apollo-server-express');

const logger = require('./logger');
const { connectToDB } = require('./database');

const startServer = async () => {
  const schema = require('./schema');

  // Initialize the app
  const app = express();
  app.use(cors());
  const buildOptions = async () => ({ schema });

  // The GraphQL endpoint
  app.use('/graphql', bodyParser.json(), graphqlExpress(buildOptions));

  // GraphiQL, a visual editor for queries
  app.use('/', graphiqlExpress({ endpointURL: '/graphql' }));
  // app.use('/graphiql', graphiqlExpress({ endpointURL: '/graphql' }));

  // Start the server
  app.listen(process.env.PORT || 3001, () => {
    logger.info(`Go to http://localhost:${process.env.PORT || 3001}/graphiql to run queries!`); // eslint-disable-line no-console
  });
};

const dbConnectAndStartServer = async () => {
  try {
    await connectToDB();
    logger.info('Connected to Mongo successfully');
    startServer();
  } catch (err) {
    logger.error(`Error connecting to mongo - ${err.message}`);
    process.exit(1);
  }
};

dbConnectAndStartServer();
