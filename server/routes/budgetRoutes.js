const express = require('express');
const router = express.Router();
const budgetController = require('../controllers/budgetController');

router.post('/add/:userId', budgetController.addBudget);

router.patch('/update/:userId/:budgetId', budgetController.updateBudget);

router.get('/get/:userId', budgetController.getBudgets);

router.delete('/delete/:userId/:budgetId', budgetController.deleteBudget);

module.exports = router;
