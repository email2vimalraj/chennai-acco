const { User, Property } = require('../../database/models');

module.exports = {
  User: {
    properties: async ({ _id }) => {
      const res = await Property.find({ user: _id });
      return res;
    },
  },

  Query: {
    users: async () => {
      const res = await User.find();
      return res;
    },
  },

  Mutation: {
    addUser: async (root, args) => {
      const res = await User.create(args.input);
      return res;
    },
  },
};
