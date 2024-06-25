const mongoose = require('mongoose');

const dbConnectionString = `mongodb+srv://${encodeURI(
  process.env.MONGO_UN
)}:${encodeURI(
  process.env.MONGO_PW
)}@scrumblebee-cluster.zjmfqxn.mongodb.net/scrumblebee?retryWrites=true&w=majority&appName=scrumblebee-cluster`;
// connection to the scrumblebee database.
const connection = mongoose.createConnection(dbConnectionString);

const { userSchema } = require('./schemas');
const User = connection.model('User', userSchema);

module.exports = {
  User
};
