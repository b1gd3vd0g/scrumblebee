/*
 * Create and export the User model, which is connected to the database and
 * contains the schema for accounts on scrumblebee.
 */

const { createConnection, Schema } = require('mongoose');

// create the schema
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
// connect to the database
const dbConnectionString = encodeURI(process.env.DB_CONNECTION);
const connection = createConnection(dbConnectionString);

/** The User model. */
const User = connection.model('User', userSchema);

module.exports = {
  User
};
