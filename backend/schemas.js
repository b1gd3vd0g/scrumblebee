const { ObjectId } = require('mongodb');

const Schema = require('mongoose').Schema;

const UserSchema = new Schema(
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
      type: [ObjectId],
      required: true
    }
  },
  {
    collection: 'users'
  }
);

const ProjectSchema = new Schema(
  {
    team: {
      type: [ObjectId],
      required: true
    },
    tasks: {
      type: [TaskSchema],
      required: true
    },
    creationDate: {
      type: Date,
      required: true
    },
    dueDate: {
      type: Date,
      required: true
    },
    sprintDays: {
      type: Number,
      required: true
    },
    completion: {
      type: Number,
      required: true,
      min: 0,
      max: 1
    }
  },
  {
    collection: 'projects'
  }
);

module.exports = {
  UserSchema,
  ProjectSchema
};
