// client/views/overview/budget/GetBudgets.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { View, Text, FlatList } from 'react-native';
import { BACKEND_URL } from '@env';

const GetBudgets = ({ userId }) => {
  const [budgets, setBudgets] = useState([]);

  const fetchBudgets = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/api/budgets/get/${userId}`);
      setBudgets(response.data.budgets);
    } catch (error) {
      console.error('Failed to fetch budgets', error);
    }
  };

  useEffect(() => {
    fetchBudgets();
  }, []);

  return (
    <FlatList
      data={budgets}
      keyExtractor={(item) => item._id}
      renderItem={({ item }) => (
        <View>
          <Text>Start Date: {item.startDate}</Text>
          <Text>End Date: {item.endDate}</Text>
          <Text>Amount: {item.amount}</Text>
        </View>
      )}
    />
  );
};

export default GetBudgets;

