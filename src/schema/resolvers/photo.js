const { Property, Photo } = require('../../database/models');

module.exports = {
  Photo: {
    property: async ({ property }) => {
      const res = await Property.findOne({ _id: property });
      return res;
    },
  },

  Query: {
    photos: async (root, args) => {
      const res = await Photo.find({ property: args.propertyId });
      return res;
    },
  },

  Mutation: {
    addPhoto: async (root, args) => {
      const res = await Photo.create(args.input);
      return res;
    },
  },
};
