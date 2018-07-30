const Query = {
  user: (_, args, context, info) => {
    return context.prisma.query.user(
      {
        where: {
          id: args.id
        }
      },
      info
    )
  },

  properties: (_, args, context, info) => {
    const { where, orderBy, skip, after, before, first, last } = args
    return context.prisma.query.properties(
      {
        where,
        orderBy,
        skip,
        after,
        before,
        first,
        last
      },
      info
    )
  },

  property: (_, args, context, info) => {
    const { id } = args

    return context.prisma.query.property(
      {
        where: {
          id
        }
      },
      info
    )
  },

  photos: (_, args, context, info) => {
    const { propertyId } = args
    return context.prisma.query.photos(
      {
        where: {
          property: {
            id: propertyId
          }
        }
      },
      info
    )
  },

  bookings: (_args, context, info) => {
    const { where, orderBy, skip, after, before, first, last } = args
    return context.prisma.query.bookings(
      {
        where,
        orderBy,
        skip,
        after,
        before,
        first,
        last
      },
      info
    )
  }
}

module.exports = { Query }
