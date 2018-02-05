const { Property, User, Booking } = require('../../database/models');

module.exports = {
  Booking: {
    user: async ({ user }) => {
      const res = await User.findOne({ _id: user });
      return res;
    },

    property: async ({ property }) => {
      const res = await Property.findOne({ _id: property });
      return res;
    },
  },

  Query: {
    bookings: async (root, args) => {
      const res = await Booking.find(args.filter);
      return res;
    },
  },

  Mutation: {
    addBooking: async (root, args) => {
      const res = await Booking.create(args.input);
      return res;
    },
  },
};
