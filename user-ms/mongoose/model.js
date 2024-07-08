const { createConnection, Schema } = require('mongoose');

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

const User = connection.model('User', userSchema);

module.exports = User;
