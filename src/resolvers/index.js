const { Query } = require('./Query')
const { Mutation } = require('./Mutation')
const { authQueries, authMutations } = require('graphql-authentication')

module.exports = {
  Query: {
    ...authQueries,
    ...Query
  },
  Mutation: {
    ...authMutations,
    ...Mutation
  }
}
