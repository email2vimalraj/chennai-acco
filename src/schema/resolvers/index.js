const { mergeResolvers } = require('merge-graphql-schemas');

const resolvers = [
  require('./common'),
  require('./user'),
  require('./property'),
];

module.exports = mergeResolvers(resolvers);
