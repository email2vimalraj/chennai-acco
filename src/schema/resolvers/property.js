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
    properties: async () => {
      const res = await Property.find();
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
