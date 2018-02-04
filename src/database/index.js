const { Mongoose } = require('mongoose');

let connection = null;

const connectToDB = async () => {
  const mongoose = new Mongoose();
  mongoose.Promise = global.Promise;

  await mongoose.connect('mongodb://localhost/chennai-acco-db');
  connection = mongoose;
};

const getDB = () => {
  if (!connection) {
    throw new Error('Call connectToDB first');
  }
  return connection;
};

module.exports = {
  connectToDB,
  getDB,
};
