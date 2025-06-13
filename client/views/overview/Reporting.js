// cumleler anımasyonlu sekılde basılsın. mesela ılk cumle basıldı ıkıncı cumle ondan sonra
// yavas yavas gorunur olsun gibi

import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { BACKEND_URL } from '@env';
import axios from 'axios';

const Reporting = ({ userId, period }) => {
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
          <Text key={category} style={styles.expenseText}>
            {category} kategorisine {amount.toFixed(2)} TL harcadınız.
          </Text>
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
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: 20,
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  expenseText: {
    fontSize: 16,
    marginVertical: 5,
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
