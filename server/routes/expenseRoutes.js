const express = require('express');
const router = express.Router();
const {
  createExpense,
  getExpense,
  updateExpense,
  deleteExpense,
} = require('../controllers/expenseController');

router.post('/add/:userId', createExpense);

router.get('/get/:userId', getExpense);

router.patch('/update/:userId/:expenseId', updateExpense);

router.delete('/delete/:userId/:expenseId', deleteExpense);

module.exports = router;
