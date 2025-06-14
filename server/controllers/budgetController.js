const User = require('../models/User');

exports.addBudget = async (req, res) => {
  const { userId } = req.params;
  const { startDate, endDate, amount } = req.body;
  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const newBudget = { startDate, endDate, amount };
    user.budgets.push(newBudget); 
    await user.save();
    res.status(201).json({ message: "Budget added successfully", budget: newBudget });
  } catch (error) {
    res.status(500).json({ message: "Error adding budget", error });
  }
};

exports.updateBudget = async (req, res) => {
  const { userId, budgetId } = req.params;
  const { startDate, endDate, amount } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) {
      console.log("User not found");
      return res.status(404).json({ message: "User not found" });
    }

    console.log("User found:", user);

    const budget = user.budgets.id(budgetId);
    if (!budget) {
      console.log("Budget not found");
      return res.status(404).json({ message: "Budget not found" });
    }

    if (startDate) {
      budget.startDate = startDate;
    }

    if (endDate) {
      budget.endDate = endDate;
    }

    if (amount !== undefined) {
      budget.amount = amount;
    }

    await user.save();

    res.status(200).json({ message: "Budget updated successfully", budget });
  } catch (error) {
    console.error("Error updating budget:", error);
    res.status(500).json({ message: "Error updating budget", error: error.message });
  }
};

exports.getBudgets = async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json({ budgets: user.budgets });
  } catch (error) {
    res.status(500).json({ message: "Error fetching budgets", error });
  }
};

exports.deleteBudget = async (req, res) => {
  const { userId, budgetId } = req.params;

  console.log(`[INFO] deleteBudget called with userId: ${userId}, budgetId: ${budgetId}`);

  try {
    const user = await User.findById(userId);
    if (!user) {
      console.error(`[ERROR] User not found for userId: ${userId}`);
      return res.status(404).json({ message: "User not found" });
    }

    console.log(`[INFO] User found:`, user);

    const budgetIndex = user.budgets.findIndex(b => b._id.toString() === budgetId);
    if (budgetIndex === -1) {
      console.error(`[ERROR] Budget not found for budgetId: ${budgetId}`);
      return res.status(404).json({ message: "Budget not found" });
    }

    user.budgets.splice(budgetIndex, 1);
    await user.save();

    res.status(200).json({ message: "Budget deleted successfully" });

  } catch (error) {
    console.error(`[ERROR] Failed to delete budget for userId: ${userId}, budgetId: ${budgetId}`);
    console.error(`[ERROR DETAILS]`, error);
    res.status(500).json({ message: "Error deleting budget", error: error.message || error });
  }
};
