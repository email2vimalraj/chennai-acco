const { Property, User, Photo } = require('../../database/models');

module.exports = {
  Property: {
    user: async ({ user }) => {
      const res = await User.findOne({ _id: user });
      return res;
    },

    photos: async ({ _id }) => {
      const res = await Photo.find({ property: _id });
      return res;
    },
  },

  Query: {
    properties: async (root, args) => {
      let query = Property.find();
      if (args.ascSortBy) {
        const sortOption = {};
        sortOption[args.ascSortBy] = 1;
        query = query.sort(sortOption);
      }
      if (args.descSortBy) {
        const sortOption = {};
        sortOption[args.descSortBy] = -1;
        query = query.sort(sortOption);
      }
      if (args.limit) {
        query = query.limit(args.limit);
      }
      const res = await query.exec();
      return res;
    },
  },

  Mutation: {
    addProperty: async (root, args) => {
      const res = await Property.create(args.input);
      return res;
    },
  },
};
