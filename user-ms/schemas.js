const Schema = require('mongoose').Schema;

const userSchema = new Schema(
  {
    username: String,
    password: String,
    salt: String,
    email: String
  },
  {
    collection: 'users'
  }
);

module.exports = {
  userSchema
};
