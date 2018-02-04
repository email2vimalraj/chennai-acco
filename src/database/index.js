const { Mongoose } = require('mongoose');

let connection = null;

const connectToDB = async () => {
  const mongoose = new Mongoose();
  mongoose.Promise = global.Promise;

  let connectionString = 'mongodb://vselvam:vselvam@ds123728.mlab.com:23728/heroku_9mmbw63g';
  if (process.env.NODE_ENV === 'local') {
    connectionString = 'mongodb://localhost/chennai-acco-db';
  }

  await mongoose.connect(connectionString);
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
