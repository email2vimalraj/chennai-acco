const { mergeResolvers } = require('merge-graphql-schemas');

const resolvers = [
  require('./common'),
  require('./user'),
  require('./property'),
  require('./photo'),
];

module.exports = mergeResolvers(resolvers);
