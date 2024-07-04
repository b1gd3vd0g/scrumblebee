const { createConnection, Schema, Model } = require('mongoose');

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true
    },
    password: {
      type: String,
      required: true
    },
    salt: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    }
  },
  {
    collection: 'users'
  }
);

const connection = createConnection(encodeURI(process.env.DB_CONNECTION));

module.exports = connection.model('User', userSchema);
