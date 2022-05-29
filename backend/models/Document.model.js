const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const DocumentSchema = new Schema({
  Content: {
    type: Array,
    default: [],
  },
  Owner: {
    type: Schema.ObjectId,
    required: true,
    ref: 'users',
  },
  CollaboratorList: {
    type: [{
      type: Schema.ObjectId,
      ref: 'users',
    }],
    default: [],
  },
  Title: {
    type: String,
    default: 'Untitled',
  },
  Password: {
    type: String,
  },
  CreatedTime: {
    type: Date,
  },
  LastSaveTime: {
    type: Date,
  },
});

module.exports = mongoose.model('Document', DocumentSchema);