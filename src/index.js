const { GraphQLServer } = require('graphql-yoga')
const { Prisma } = require('prisma-binding')
const { graphqlAuthenticationConfig } = require('graphql-authentication')
const {
  GraphqlAuthenticationPrismaAdapter
} = require('graphql-authentication-prisma')
const fileUpload = require('express-fileupload')
const express = require('express')
const mkdirp = require('mkdirp')

const resolvers = require('./resolvers')

mkdirp.sync(`${__dirname}/public`)

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
      endpoint: process.env.PRISMA_ENDPOINT
    })
  })
})

server.express.use(fileUpload())
server.express.use('/public', express.static(`${__dirname}/public`))

server.post('/upload', async (req, res) => {
  const imageFile = req.files.file
  const fileExtension = imageFile.name.split('.').pop()
  const newFileName = `${req.body.propertyId}_${
    req.body.filename
  }.${fileExtension}`

  try {
    await imageFile.mv(`${__dirname}/public/${newFileName}`)

    const hostName =
      process.env.NODE_ENV === 'local'
        ? 'http://localhost'
        : 'https://chennai-acco-server.herokuapp.com'
    const hostPort = process.env.NODE_ENV === 'local' ? 4000 : ''

    const query = `mutation {
      addPhoto(input: {
        name: "${req.body.filename}",
        filePath: "${hostName}:${hostPort}/public/${newFileName}",
        property: {
          connect: {
            id: "${req.body.propertyId}"
          }
        }
      }) {
        id
      }
    }`

    const result = await fetch(`${hostName}:${hostPort}/graphql`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query })
    })

    const resJson = await result.json()
    const resData = await resJson.data

    return res.json(resData)
  } catch (error) {
    return res.status(500).send(error)
  }
})

const corsOptions = {
  origin: '*',
  preflightContinue: false
}

const serverOptions = {
  cors: corsOptions,
  endpoint: '/graphql',
  playground: '/playground'
}

server.start(serverOptions, () =>
  console.log(`Graphql server is running on http://localhost:4000`)
)
