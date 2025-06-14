const mongoose = require('mongoose');
const FinancialNote = require('./FinancialNote');
const Reminder = require('./Reminder');
const Expense = require("./Expense");
const Budget = require('./Budget'); 

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  resetPasswordCode: String,
  resetPasswordExpires: Date,
  financialNotes: {
    type: [FinancialNote.schema],
    default: []
  },
  reminders: {
    type: [Reminder.schema],
    default: []
  },
  expenses: { 
    type: [Expense.schema],
    default: []
  },
  budgets: { 
    type: [Budget.schema],
    default: []
  }
});

module.exports = mongoose.model('User', userSchema);
