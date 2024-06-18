const mongoose = require('mongoose');

const { userSchema } = require('./schemas');

const login = require('./config.json').mongoLogin;
const dbConnectionString = `mongodb+srv://${login.un}:${login.pw}@scrumblebee-cluster.zjmfqxn.mongodb.net/scrumblebee?retryWrites=true&w=majority&appName=scrumblebee-cluster`;

const connection = mongoose.createConnection(dbConnectionString);
const User = connection.model('User', userSchema);

module.exports = {
  User
};
