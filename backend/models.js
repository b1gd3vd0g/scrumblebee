const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true
    },
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
    projects: {
      type: [String],
      required: true
    }
  },
  {
    collection: 'users'
  }
);

const connectionString = (db) => {
  const credentials = require('./config.json').mongodb;
  return `mongodb+srv://${credentials.username}:${credentials.password}@scrumblebee-cluster.zjmfqxn.mongodb.net/${db}?retryWrites=true&w=majority&appName=scrumblebee-cluster`;
};

const User = new mongoose.Model('User', UserSchema);
