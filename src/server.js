const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { graphqlExpress, graphiqlExpress } = require('apollo-server-express');
const fileUpload = require('express-fileupload');

const logger = require('./logger');
const { connectToDB } = require('./database');

const startServer = async () => {
  const schema = require('./schema');
  const { Photo } = require('./database/models');

  // Initialize the app
  const app = express();
  app.use(cors());
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(fileUpload());
  app.use('/public', express.static(`${__dirname}/public`));

  const buildOptions = async () => ({ schema });

  // The GraphQL endpoint
  app.use('/graphql', bodyParser.json(), graphqlExpress(buildOptions));

  // GraphiQL, a visual editor for queries
  app.use('/graphiql', graphiqlExpress({ endpointURL: '/graphql' }));

  app.get('/ping', (req, res) => {
    res.json({ message: 'Ping success' });
  });

  app.post('/upload', (req, res) => {
    const imageFile = req.files.file;
    const fileExtension = imageFile.name.split('.').pop();
    const newFileName = `${req.body.propertyId}_${req.body.filename}.${fileExtension}`;

    imageFile.mv(`${__dirname}/public/${newFileName}`, (err) => {
      if (err) {
        return res.status(500).send(err);
      }

      const hostName = process.env.NODE_ENV === 'local' ? 'http://localhost' : 'https://chennai-acco-server.herokuapp.com';
      const hostPort = process.env.PORT || 3001;

      const args = {
        name: req.body.filename,
        property: req.body.propertyId,
        filePath: `${hostName}:${hostPort}/public/${newFileName}`,
      };
      const newPhoto = new Photo(args);
      newPhoto.save((dberr) => {
        if (dberr) {
          return res.status(500).send(dberr);
        }
        return res.json({ message: 'Upload success' });
      });
    });
  });

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
