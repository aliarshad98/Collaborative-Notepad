const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  FirstName: {
    type: String,
    required: true,
    trim: true,
    minlength: 3,
  },
  LastName: {
    type: String,
    required: true,
    trim: true,
    minlength: 3,
  },
  EmailAddress: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  Password: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('User', UserSchema);