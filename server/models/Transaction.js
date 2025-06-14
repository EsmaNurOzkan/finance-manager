const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  amount: { type: Number, required: true }, 
  date: { type: Date, default: Date.now }, 
  description: { type: String }, 
  category: { type: String },
  createdAt: { type: Date, default: Date.now } 
});

module.exports = mongoose.model('Transaction', transactionSchema);
