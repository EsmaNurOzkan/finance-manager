const Expense = require('../models/Expense');
const User = require('../models/User');

const createExpense = async (req, res) => {
  try {
    const { userId } = req.params;
    const { amount, category, date } = req.body;

    const newExpense = new Expense({
      amount,
      category,
      date: date || Date.now(), 
    });

    await newExpense.save();

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    user.expenses.push(newExpense);
    await user.save();

    res.status(201).json({ message: 'Expense created successfully', newExpense });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create expense' });
  }
};

const getExpense = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId).populate('expenses');

    if (!user) return res.status(404).json({ error: 'User not found' });

    res.status(200).json(user.expenses);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get expenses' });
  }
};

const updateExpense = async (req, res) => {
  try {
    const { userId, expenseId } = req.params;
    const { amount, category, date } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const expenseExists = user.expenses.some(exp => exp.toString() === expenseId);
    if (!expenseExists) {
      return res.status(403).json({ error: 'Unauthorized to update this expense' });
    }

    const updatedExpense = await Expense.findByIdAndUpdate(
      expenseId,
      {
        amount,
        category,
        date: date || Date.now(), 
      },
      { new: true }
    );

    if (!updatedExpense) return res.status(404).json({ error: 'Expense not found' });

    res.status(200).json({ message: 'Expense updated successfully', updatedExpense });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update expense' });
  }
};


const deleteExpense = async (req, res) => {
  try {
    const { expenseId, userId } = req.params;

    const deletedExpense = await Expense.findByIdAndDelete(expenseId);
    if (!deletedExpense) return res.status(404).json({ error: 'Expense not found' });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    user.expenses = user.expenses.filter(exp => exp._id.toString() !== expenseId);
    await user.save();

    res.status(200).json({ message: 'Expense deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete expense' });
  }
};

module.exports = {
  createExpense,
  getExpense,
  updateExpense,
  deleteExpense,
};
