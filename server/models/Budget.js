const mongoose = require('mongoose');

const budgetSchema = new mongoose.Schema({
  startDate: { type: Date, required: true }, 
  endDate: { type: Date, required: true },  
  amount: { type: Number, required: true }   
});

module.exports = mongoose.model('Budget', budgetSchema);
