//responsıve ve şık gorunum ıcın css!!
import React, { useState } from 'react';
import axios from 'axios';
import { View, TextInput, Button, Text } from 'react-native';
import { BACKEND_URL } from '@env';

const UpdateBudget = ({ userId, budgetId, onSuccess }) => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [amount, setAmount] = useState('');
  const [success, setSuccess] = useState(null);

  const handleUpdateBudget = async () => {
    try {
      await axios.patch(`${BACKEND_URL}/api/budgets/update/${userId}/${budgetId}`, {
        startDate,
        endDate,
        amount: Number(amount),
      });
      setSuccess(true);
      onSuccess && onSuccess(amount); // Pass the updated amount to onSuccess
    } catch (error) {
      setSuccess(false);
    }
  };

  return (
    <View>
      <TextInput placeholder="Start Date" value={startDate} onChangeText={setStartDate} />
      <TextInput placeholder="End Date" value={endDate} onChangeText={setEndDate} />
      <TextInput placeholder="Amount" value={amount} onChangeText={setAmount} keyboardType="numeric" />
      <Button title="Update Budget" onPress={handleUpdateBudget} />
      {success === true && <Text style={{ color: 'green' }}>Budget updated successfully!</Text>}
      {success === false && <Text style={{ color: 'red' }}>Failed to update budget.</Text>}
    </View>
  );
};

export default UpdateBudget;
