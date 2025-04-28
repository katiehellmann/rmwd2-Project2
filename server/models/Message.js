const mongoose = require('mongoose');
const _ = require('underscore');

const setName = (name) => _.escape(name).trim();

const MessageSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    set: setName,
  },
  subtitle: {
    type: String,
    required: true,
    min: 0,
  },
  content: {
    type: String,
    required: true,
    default: '',
  },
  owner: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: 'Account',
  },
  createdData: {
    type: Date,
    default: Date.now,
  },
});

MessageSchema.statics.toAPI = (doc) => ({
  title: doc.title,
  subtitle: doc.subtitle,
  content: doc.content,
});

const MessageModel = mongoose.model('Message', MessageSchema);
module.exports = MessageModel;
