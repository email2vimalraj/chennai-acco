const { GraphQLServer } = require('graphql-yoga')
const { Prisma } = require('prisma-binding')
const { graphqlAuthenticationConfig } = require('graphql-authentication')
const {
  GraphqlAuthenticationPrismaAdapter
} = require('graphql-authentication-prisma')

const resolvers = require('./resolvers')

const server = new GraphQLServer({
  typeDefs: 'src/schema.graphql',
  resolvers,
  resolverValidationOptions: {
    requireResolversForResolveType: false
  },
  context: req => ({
    ...req,
    graphqlAuthentication: graphqlAuthenticationConfig({
      adapter: new GraphqlAuthenticationPrismaAdapter({
        prismaContextName: 'prisma'
      }),
      secret: 'chennai-acco-secret-key'
    }),
    prisma: new Prisma({
      typeDefs: 'src/generated/prisma.graphql',
      endpoint:
        'https://eu1.prisma.sh/vimalraj-selvam-a2323f/chennai-acco-server/dev'
    })
  })
})

server.start(() =>
  console.log(`Graphql server is running on http://localhost:4000`)
)
