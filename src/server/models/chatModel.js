const mongoose = require('mongoose');

const { Schema } = mongoose;

const ChatSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true,
  },
}, { timestamps: true });

const ChatModel = mongoose.model('chat', ChatSchema);

module.exports = ChatModel;
