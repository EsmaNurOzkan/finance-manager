const mongoose = require('mongoose');

const reminderSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String }, 
  dueDate: { type: Date, required: true }, 
  createdAt: { type: Date, default: Date.now }, 
});

module.exports = mongoose.model('Reminder', reminderSchema);
