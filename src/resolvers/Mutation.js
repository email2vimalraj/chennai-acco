const Mutation = {
  addProperty: (_, args, context, info) => {
    const data = args.input

    return context.prisma.mutation.createProperty(
      {
        data
      },
      info
    )
  },

  addPhoto: (_, args, context, info) => {
    const data = args.input

    return context.prisma.mutation.createPhoto({ data }, info)
  },

  addBooking: (_, args, context, info) => {
    const data = args.input
    return context.prisma.mutation.createBooking({ data }, info)
  }
}

module.exports = { Mutation }
