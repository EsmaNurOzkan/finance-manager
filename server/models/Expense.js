const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
  amount: { type: Number, required: true }, 
  date: { type: Date, default: Date.now }, 
  category: { type: String }, 
});

module.exports = mongoose.model('Expense', expenseSchema);

