import React, { useEffect, useState, useContext } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import { ExpenseContext } from '@/contexts/ExpenseContext';
import axios from 'axios';

interface Expense {
  category: string;
  amount: number;
  date: string;
}

interface PieChartGraphProps {
  period: string;
  userId: string | null;
}

const PieChartGraph: React.FC<PieChartGraphProps> = ({ period, userId }) => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { expenseAdded } = useContext(ExpenseContext)!;

  useEffect(() => {
    if (!userId) return;

    const fetchExpenses = async () => {
      try {
        const response = await axios.get(
          `${process.env.EXPO_PUBLIC_BACKEND_URL}/api/expenses/get/${userId}`
        );
        setExpenses(response.data);
      } catch (err) {
        setError('An error occurred while fetching expenses.');
      } finally {
        setLoading(false);
      }
    };

    fetchExpenses();
  }, [userId, expenseAdded]);

  const filteredExpenses = expenses.filter((expense) => {
    const today = new Date();
    const expenseDate = new Date(expense.date);
    if (period === 'Daily') {
      return expenseDate.toDateString() === today.toDateString();
    } else if (period === 'Weekly') {
      const weekAgo = new Date();
      weekAgo.setDate(today.getDate() - 7);
      return expenseDate >= weekAgo && expenseDate <= today;
    } else if (period === 'Monthly') {
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

  const chartData = Object.keys(groupedExpenses).map((category) => ({
    name: category,
    amount: groupedExpenses[category],
    color: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
    legendFontColor: "#7F7F7F",
    legendFontSize: 15
  }));

  if (loading) {
    return <Text style={styles.loadingText}>Loading...</Text>;
  }

  if (error) {
    return <Text style={styles.errorText}>{error}</Text>;
  }

  return (
    <View style={styles.container}>
      {chartData.length > 0 ? (
        <PieChart
          data={chartData}
          width={Dimensions.get('window').width - 40}
          height={220}
          chartConfig={{
            backgroundColor: '#e26a00',
            backgroundGradientFrom: '#ff6f00',
            backgroundGradientTo: '#ff9e3d',
            decimalPlaces: 2,
            color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            style: {
              borderRadius: 16
            },
          }}
          accessor="amount"
          backgroundColor="transparent"
          paddingLeft="15"
          center={[10, 10]}
        />
      ) : (
        <Text style={styles.noDataText}>No expenses found for {period}.</Text>
      )}
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 10,
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

export default PieChartGraph;
