import React, { createContext, useState, ReactNode } from "react";

interface ExpenseContextType {
  expenseAdded: boolean;
  setExpenseAdded: React.Dispatch<React.SetStateAction<boolean>>;
}

export const ExpenseContext = createContext<ExpenseContextType | null>(null);

export const ExpenseProvider = ({ children }: { children: ReactNode }) => {
  const [expenseAdded, setExpenseAdded] = useState<boolean>(false);

  const value: ExpenseContextType = {
    expenseAdded,
    setExpenseAdded,
  };

  return (
    <ExpenseContext.Provider value={value}>
      {children}
    </ExpenseContext.Provider>
  );
};
