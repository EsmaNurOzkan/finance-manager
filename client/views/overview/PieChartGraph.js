
import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';
import { BACKEND_URL } from '@env';
import axios from 'axios';

const PieChartGraph = ({ userId, period }) => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Backend'den harcamaları al
  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/api/expenses/get/${userId}`);
        setExpenses(response.data);
      } catch (err) {
        setError('Harcamalar alınırken bir hata oluştu.');
      } finally {
        setLoading(false);
      }
    };

    fetchExpenses();
  }, [userId]);

  // Zaman aralığına göre harcamaları filtreleme
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

  // Kategorilere göre veriyi grupla
  const groupedExpenses = filteredExpenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
    return acc;
  }, {});

  // Pie chart için veriyi formatla
  const chartData = Object.keys(groupedExpenses).map((category) => ({
    name: category,
    amount: groupedExpenses[category],
    color: `#${Math.floor(Math.random() * 16777215).toString(16)}`, // Random renk
    legendFontColor: '#7F7F7F',
    legendFontSize: 15,
  }));

  if (loading) {
    return <Text style={styles.loadingText}>Yükleniyor...</Text>;
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
            color: () => `rgba(0, 0, 0, 0.5)`,
          }}
          accessor="amount"
          backgroundColor="transparent"
          paddingLeft="15"
        />
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
