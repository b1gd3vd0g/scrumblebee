/** A function to connect to a database within the scrumblebee-cluster. */
const mongoUri = (db) => {
  const credentials = require('./config.json').mongodb;
  return `mongodb+srv://${credentials.username}:${credentials.password}@scrumblebee-cluster.zjmfqxn.mongodb.net/${db}?retryWrites=true&w=majority&appName=scrumblebee-cluster`;
};

const mongoose = require('mongoose');
const { UserSchema } = require('./schemas');

const dbConnection = mongoose.createConnection(mongoUri('scrumblebee'));

const User = dbConnection.model('User', UserSchema);

module.exports = {
  User
};
