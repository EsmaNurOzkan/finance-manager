import React, { useContext, useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import axios from 'axios';
import { ExpenseContext } from "@/contexts/ExpenseContext";

interface Expense {
  category: string;
  amount: number;
  date: string;
}

interface ReportingProps {
  period: string;
  userId: string | null;
}

const Reporting: React.FC<ReportingProps> = ({ period, userId }) => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { expenseAdded, setExpenseAdded } = useContext(ExpenseContext)!;

  useEffect(() => {
    if (!userId) return;

    const fetchExpenses = async () => {
      try {
        const response = await axios.get(`${process.env.EXPO_PUBLIC_BACKEND_URL}/api/expenses/get/${userId}`);
        setExpenses(response.data);
      } catch (err) {
        setError('Harcamalar alınırken bir hata oluştu.');
      } finally {
        setLoading(false);
      }
    };

    fetchExpenses();
  }, [userId, expenseAdded]);

  const filteredExpenses = expenses.filter((expense) => {
    const today = new Date();
    const expenseDate = new Date(expense.date);

    if (period === 'Günlük') {
      return expenseDate.toDateString() === today.toDateString();
    } else if (period === 'Haftalık') {
      const weekAgo = new Date();
      weekAgo.setDate(today.getDate() - 7);
      return expenseDate >= weekAgo && expenseDate <= today;
    } else if (period === 'Aylık') {
      return (
        expenseDate.getMonth() === today.getMonth() &&
        expenseDate.getFullYear() === today.getFullYear()
      );
    }
    return false;
  });

  const groupedExpenses = filteredExpenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
    return acc;
  }, {} as Record<string, number>);

  if (loading) {
    return <Text style={styles.loadingText}>Yükleniyor...</Text>;
  }

  if (error) {
    return <Text style={styles.errorText}>{error}</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>{period} Harcamalarınız</Text>
      {Object.keys(groupedExpenses).length > 0 ? (
        Object.entries(groupedExpenses).map(([category, amount]) => (
          <View key={category} style={styles.expenseItem}>
            <Text style={styles.bullet}>•</Text>
            <Text style={styles.expenseText}>
              {category} kategorisine {amount.toFixed(2)} TL harcadınız.
            </Text>
          </View>
        ))
      ) : (
        <Text style={styles.noDataText}>
          {period} için harcama bulunamadı.
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent:"center",
    textAlign:"center",
    alignItems:"center",
    padding: 20,
  },
  headerText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  expenseItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
  },
  bullet: {
    fontSize: 32,
    marginRight: 10,
    color: 'black',
  },
  expenseText: {
    fontSize: 16,
  },
  noDataText: {
    fontSize: 16,
    color: '#888',
  },
  loadingText: {
    fontSize: 16,
    color: '#888',
  },
  errorText: {
    fontSize: 16,
    color: 'red',
  },
});

export default Reporting;
